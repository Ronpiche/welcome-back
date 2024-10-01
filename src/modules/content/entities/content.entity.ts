import type { FirestoreDocumentType } from "@src/configs/types/Firestore.types";

export class ContentEntity {
  id: string;

  data: FirestoreDocumentType;
}