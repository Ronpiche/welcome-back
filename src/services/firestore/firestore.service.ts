import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Filter, Firestore, Query } from '@google-cloud/firestore';
import { FIRESTORE_COLLECTIONS, FirestoreDocumentType, FirestoreErrorCode } from '@src/configs/types/Firestore.types';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';

@Injectable()
export class FirestoreService {
  constructor(
    private readonly firestore: Firestore,
    private readonly logger: Logger,
  ) {}

  private applyFilters(query: FirebaseFirestore.Query, filter: Filter): FirebaseFirestore.Query {
    let filteredQuery = query;
    Object.entries(filter).forEach(([field, value]) => {
      if (field === 'arrivalDate') {
        Object.entries(value).forEach(([index, val]) => {
          if (index === '$gte') {
            filteredQuery = filteredQuery.where(field, '>=', val);
          } else if (index === '$lte') {
            filteredQuery = filteredQuery.where(field, '<=', val);
          }
        });
      } else {
        filteredQuery = filteredQuery.where(field, '==', value);
      }
    });

    return filteredQuery;
  }

  async getAllDocuments<T extends FirestoreDocumentType>(
    collection: FIRESTORE_COLLECTIONS,
    filter?: Filter,
  ): Promise<T[]> {
    const documents: T[] = [];
    try {
      const query = this.firestore.collection(collection);
      const filteredQuery = filter ? this.applyFilters(query, filter) : query;
      const querySnapshot = await filteredQuery.get();

      querySnapshot.forEach((doc) => {
        documents.push({
          ...(doc.data() as T),
        });
      });

      return documents;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getDocument<T extends FirestoreDocumentType>(
    collection: FIRESTORE_COLLECTIONS,
    documentId: string,
  ): Promise<T> {
    let documentSnapshot: FirebaseFirestore.DocumentSnapshot<
      FirebaseFirestore.DocumentData,
      FirebaseFirestore.DocumentData
    >;
    try {
      documentSnapshot = await this.firestore.collection(collection).doc(documentId).get();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!documentSnapshot.exists) {
      throw new NotFoundException('Document not found in DB');
    }

    return documentSnapshot.data() as T;
  }

  async getByEmail<T extends FirestoreDocumentType>(collection: FIRESTORE_COLLECTIONS, email: string): Promise<T> {
    let document: T;
    const documentsSnapshot = await this.firestore.collection(collection).where('email', '==', email).get();
    if (documentsSnapshot.size > 1) {
      throw new HttpException('Multiple users found', 400);
    } else if (documentsSnapshot.size === 1) {
      documentsSnapshot.forEach((doc) => {
        document = doc.data() as T;
      });
    } else {
      throw new NotFoundException('User not found in DB');
    }

    return document;
  }

  async saveDocument<T extends FirestoreDocumentType>(
    collection: FIRESTORE_COLLECTIONS,
    data: Record<string, any>,
  ): Promise<T> {
    try {
      const documentRef = this.firestore.collection(collection).doc(data._id);

      await documentRef.create(data);

      const id = documentRef.id;

      this.logger.log(`[saveDocument] - data saved to database, id:${id}`);

      return await this.getDocument(collection, id);
    } catch (error) {
      if (error.code === FirestoreErrorCode.ALREADY_EXISTS) {
        throw new HttpException('Document already exists.', HttpStatus.CONFLICT);
      }
      this.logger.error(error);
      throw error;
    }
  }

  async updateDocument<T extends FirestoreDocumentType>(
    collection: FIRESTORE_COLLECTIONS,
    documentId: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    try {
      await this.firestore
        .collection(collection)
        .doc(documentId)
        .update({ ...data });
      return await this.getDocument(collection, documentId);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteDocument(collection: FIRESTORE_COLLECTIONS, documentId: string): Promise<void> {
    await this.firestore.collection(collection).doc(documentId).delete();
  }

  async updateManyDocuments(
    collection: FIRESTORE_COLLECTIONS,
    filter: Filter,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      const collectionRef = this.firestore.collection(collection);

      let query = collectionRef as Query;
      Object.keys(filter).forEach((key) => {
        query = query.where(key, '==', filter[key]);
      });

      const snapshot = await query.get();
      const batch = this.firestore.batch();
      snapshot.forEach((doc) => {
        const docRef = collectionRef.doc(doc.id);
        batch.update(docRef, data);
      });

      await batch.commit();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /**
   * this function is here to fix problems in the database.
   * When the legacy hub mongodb database was migrated to Firestore
   * Some object properties was saved as strings. The function fixes easily
   * the problem by changing the string property to an object, then saves back
   * to Firestore. It may be removed when all similar problems will be fixed.
   *
   * @param {string} collection the name of the targetted collection
   * @param  {string} property the property that needs to be transformed to an object
   */
  async transformToObjectAndSaveProperty(collection: FIRESTORE_COLLECTIONS, property: string): Promise<void> {
    try {
      const documents = (await this.getAllDocuments(collection)) as WelcomeUser[];

      for (const doc of documents) {
        let value = doc[property];
        if (value === undefined || value === null) {
          continue;
        }

        if (value === '') {
          value = {};
        } else if (value && typeof value === 'string') {
          try {
            const propertyToObject: object = JSON.parse(value.replace(/'/g, '"'));
            value = propertyToObject;
            await this.updateDocument(collection, doc._id, { [property]: value });
          } catch (error) {
            this.logger.error(`Error parsing property for document ${doc._id}:`, error);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error transforming and saving appGames:', error);
      throw error;
    }
  }
}
