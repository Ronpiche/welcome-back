import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Filter, Firestore, Query } from "@google-cloud/firestore";
import { FIRESTORE_COLLECTIONS, FirestoreDocumentType, FirestoreErrorCode } from "@src/configs/types/Firestore.types";

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
      const filteredQuery = filter !== undefined ? query.where(filter) : query;
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

  public async saveDocument<T extends FirestoreDocumentType>(
    collection: FIRESTORE_COLLECTIONS,
    data: Record<string, unknown>,
  ): Promise<T> {
    try {
      let id = typeof data._id === "string" ? data._id : undefined;
      if (id === undefined) {
        const documentRef = await this.firestore.collection(collection).add(data);
        id = documentRef.id;
      } else {
        const documentRef = this.firestore.collection(collection).doc(id);
        await documentRef.create(data);
      }
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
}