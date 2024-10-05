import { Question } from "@common/shared-types";
import { DocumentReference, Query, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { docToQuestion } from "../utils/utils";
import { collection } from "./collection";

export async function getAll(complexity?: string, categories?: string[]): Promise<Question[]> {
  let query: Query = collection;
  if (categories !== undefined) {
    query = query.where("complexity", "==", complexity);
  }
  if (categories !== undefined) {
    query = query.where("categories", "array-contains-any", categories);
  }

  let querySnapshot: QuerySnapshot = await query.get();
  let docSnapshots: QueryDocumentSnapshot[] = querySnapshot.docs;
  return docSnapshots.map(docToQuestion);
}

export async function get(id: string): Promise<Question | null> {
  let doc: DocumentReference = collection.doc(id);

  let docSnapshot = await doc.get();
  if (!docSnapshot.exists) {
    return null;
  }

  return docToQuestion(docSnapshot);
}
