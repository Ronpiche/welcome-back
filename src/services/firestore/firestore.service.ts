import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { DocumentReference, Filter, Firestore, Query } from "@google-cloud/firestore";
import { FIRESTORE_COLLECTIONS, FirestoreDocumentType, FirestoreErrorCode } from "@src/configs/types/Firestore.types";

@Injectable()
export class FirestoreService {
  public constructor(
    private readonly firestore: Firestore,
    private readonly logger: Logger,
  ) {}

  public getDoc(
    collection: FIRESTORE_COLLECTIONS,
    documentId: string,
    parentDoc: DocumentReference | Firestore = this.firestore,
  ): DocumentReference {
    return parentDoc.collection(collection).doc(documentId);
  }

  public async getAllDocuments<T extends FirestoreDocumentType>(
    collection: FIRESTORE_COLLECTIONS,
    filter?: Filter,
    parentDoc: DocumentReference | Firestore = this.firestore,
  ): Promise<T[]> {
    const documents: T[] = [];
    try {
      const query = parentDoc.collection(collection);
      const filteredQuery = filter !== undefined ? query.where(filter) : query;
      const querySnapshot = await filteredQuery.get();
      querySnapshot.forEach(docData => {
        documents.push({
          ...(docData.data() as T),
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
    parentDoc: DocumentReference | Firestore = this.firestore,
  ): Promise<T> {
    try {
      const documentSnapshot = await parentDoc.collection(collection).doc(documentId).get();
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
    parentDoc: DocumentReference | Firestore = this.firestore,
  ): Promise<T> {
    try {
      let id = typeof data._id === "string" ? data._id : "";
      const documentRef = id !== "" ? parentDoc.collection(collection).doc(id) : parentDoc.collection(collection).doc();
      id = documentRef.id;
      await documentRef.create({ ...data, _id: id });
      this.logger.log(`[saveDocument] - data saved to database, id:${id}`);

      return await this.getDocument(collection, id, parentDoc);
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
    parentDoc: DocumentReference | Firestore = this.firestore,
  ): Promise<T> {
    try {
      await parentDoc
        .collection(collection)
        .doc(documentId)
        .update({ ...data });

      return await this.getDocument(collection, documentId);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async deleteDocument(
    collection: FIRESTORE_COLLECTIONS,
    documentId: string,
    parentDoc: DocumentReference | Firestore = this.firestore,
  ): Promise<void> {
    try {
      await parentDoc.collection(collection).doc(documentId).delete();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async deleteRecursive(doc: DocumentReference): Promise<void> {
    try {
      await this.firestore.recursiveDelete(doc);
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

  public getCollection(collectionName: string): FirebaseFirestore.CollectionReference {
    return this.firestore.collection(collectionName);
  }
 
}