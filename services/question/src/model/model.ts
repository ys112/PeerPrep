import { Question } from "@common/shared-types";
import { Query } from "firebase-admin/firestore";
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

  let querySnapshot = await query.get();
  return querySnapshot.docs.map(docToQuestion);
}
