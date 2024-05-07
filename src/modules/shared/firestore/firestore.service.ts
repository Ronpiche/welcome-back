import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Filter, Firestore, Query } from '@google-cloud/firestore';
import { RoleDto } from '@/modules/authorization/dto/authorization.dto';
import { FirestoreDocumentType, FirestoreErrorCode } from '../types/Firestore.types';

@Injectable()
export class FirestoreService {
  constructor(
    private readonly firestore: Firestore,
    private readonly logger: Logger,
  ) {}

  private applyFilters(query: FirebaseFirestore.Query, filter: Filter): FirebaseFirestore.Query {
    let filteredQuery = query;
    Object.entries(filter).forEach(([field, value]) => {
      filteredQuery = filteredQuery.where(field, '==', value);
    });

    return filteredQuery;
  }

  async getAllDocuments(collection: string, filter?: Filter): Promise<FirestoreDocumentType[]> {
    const documents: FirestoreDocumentType[] = [];
    const query = this.firestore.collection(collection);
    const filteredQuery = filter ? this.applyFilters(query, filter) : query;
    const querySnapshot = await filteredQuery.get();

    querySnapshot.forEach((doc) => {
      documents.push({
        ...(doc.data() as FirestoreDocumentType),
      });
    });

    return documents;
  }

  async getDocument(collection: string, documentId: string): Promise<FirestoreDocumentType> {
    const documentSnapshot = await this.firestore.collection(collection).doc(documentId).get();
    if (documentSnapshot.exists) {
      return documentSnapshot.data() as FirestoreDocumentType;
    } else {
      throw new HttpException('Document not found in DB', HttpStatus.NOT_FOUND);
    }
  }

  async saveDocument(
    collection: string,
    data: Record<string, unknown> | RoleDto,
  ): Promise<{ id: string; status: string }> {
    try {
      const documentRef = this.firestore.collection(collection).doc();

      await documentRef.set(data, { merge: false });

      const id = documentRef.id;

      return { status: 'OK', id };
    } catch (error) {
      if (error.code === FirestoreErrorCode.ALREADY_EXISTS) {
        throw new HttpException('Document already exists.', HttpStatus.CONFLICT);
      }
      this.logger.error(error);
      throw error;
    }
  }

  async updateDocument(collection: string, documentId: string, data: RoleDto | Record<string, unknown>): Promise<void> {
    await this.firestore
      .collection(collection)
      .doc(documentId)
      .update({ ...data });
  }

  async deleteDocument(collection: string, documentId: string): Promise<void> {
    await this.firestore.collection(collection).doc(documentId).delete();
  }

  async updateManyDocuments(collection: string, filter: Filter, data: Record<string, unknown>): Promise<void> {
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
}
