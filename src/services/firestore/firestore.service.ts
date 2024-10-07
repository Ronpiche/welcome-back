import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Filter, Firestore, Query } from "@google-cloud/firestore";
import { FIRESTORE_COLLECTIONS, FirestoreDocumentType, FirestoreErrorCode } from "@src/configs/types/Firestore.types";
import { WelcomeUser } from "@modules/welcome/entities/user.entity";

@Injectable()
export class FirestoreService {
  public constructor(
    private readonly firestore: Firestore,
    private readonly logger: Logger,
  ) {}

  public async getAllDocuments<T extends FirestoreDocumentType>(
    collection: FIRESTORE_COLLECTIONS,
    filter?: Filter,
  ): Promise<T[]> {
    const documents: T[] = [];
    try {
      const query = this.firestore.collection(collection);
      const filteredQuery = filter ? this.applyFilters(query, filter) : query;
      const querySnapshot = await filteredQuery.get();
      querySnapshot.forEach(doc => {
        documents.push({
          ...(doc.data() as T),
        });
      });

      return documents;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async getDocument<T extends FirestoreDocumentType>(
    collection: FIRESTORE_COLLECTIONS,
    documentId: string,
  ): Promise<T> {
    try {
      const documentSnapshot = await this.firestore.collection(collection).doc(documentId).get();
      if (!documentSnapshot.exists) {
        throw new NotFoundException("Document not found in DB");
      }
      return documentSnapshot.data() as T;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async getByEmail<T extends FirestoreDocumentType>(collection: FIRESTORE_COLLECTIONS, email: string): Promise<T> {
    try {
      const documentsSnapshot = await this.firestore.collection(collection).where("email", "==", email).get();
      if (documentsSnapshot.size === 0) {
        throw new NotFoundException("User not found in DB");
      }
      if (documentsSnapshot.size > 1) {
        throw new ConflictException("Multiple users found");
      }
      let document: T | null = null;
      documentsSnapshot.forEach(doc => {
        document = doc.data() as T;
      });

      return document;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async saveDocument<T extends FirestoreDocumentType>(
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
      if (error instanceof Error) {
        if ("code" in error && error.code === FirestoreErrorCode.ALREADY_EXISTS) {
          throw new ConflictException("Document already exists.");
        }
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async updateDocument<T extends FirestoreDocumentType>(
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
      throw new InternalServerErrorException();
    }
  }

  public async deleteDocument(collection: FIRESTORE_COLLECTIONS, documentId: string): Promise<void> {
    try {
      await this.firestore.collection(collection).doc(documentId).delete();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async updateManyDocuments(
    collection: FIRESTORE_COLLECTIONS,
    filter: Filter,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      const collectionRef = this.firestore.collection(collection);

      let query = collectionRef as Query;
      Object.keys(filter).forEach(key => {
        query = query.where(key, "==", filter[key]);
      });

      const snapshot = await query.get();
      const batch = this.firestore.batch();
      snapshot.forEach(doc => {
        const docRef = collectionRef.doc(doc.id);
        batch.update(docRef, data);
      });

      await batch.commit();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * this function is here to fix problems in the database.
   * When the legacy hub mongodb database was migrated to Firestore
   * Some object properties was saved as strings. The function fixes easily
   * the problem by changing the string property to an object, then saves back
   * to Firestore. It may be removed when all similar problems will be fixed.
   *
   * @param {string} collection the name of the targeted collection
   * @param  {string} property the property that needs to be transformed to an object
   */
  public async transformToObjectAndSaveProperty(collection: FIRESTORE_COLLECTIONS, property: string): Promise<void> {
    try {
      // eslint-disable-next-line
      const documents = (await this.getAllDocuments(collection)) as WelcomeUser[];

      for (const doc of documents) {
        let value = doc[property];
        if (value === undefined || value === null) {
          continue;
        }

        if (value === "") {
          value = {};
        } else if (value && typeof value === "string") {
          try {
            const propertyToObject: object = JSON.parse(value.replace(/'/g, "\""));
            value = propertyToObject;
            await this.updateDocument(collection, doc._id, { [property]: value });
          } catch (error) {
            this.logger.error(`Error parsing property for document ${doc._id}:`, error);
          }
        }
      }
    } catch (error) {
      this.logger.error("Error transforming and saving appGames:", error);
      throw new InternalServerErrorException();
    }
  }

  private applyFilters(query: FirebaseFirestore.Query, filter: Filter): FirebaseFirestore.Query {
    let filteredQuery = query;
    Object.entries(filter).forEach(([field, value]) => {
      if (field === "arrivalDate") {
        Object.entries(value).forEach(([index, val]) => {
          if (index === "$gte") {
            filteredQuery = filteredQuery.where(field, ">=", val);
          } else if (index === "$lte") {
            filteredQuery = filteredQuery.where(field, "<=", val);
          }
        });
      } else {
        filteredQuery = filteredQuery.where(field, "==", value);
      }
    });

    return filteredQuery;
  }
}