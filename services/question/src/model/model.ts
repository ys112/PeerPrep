/* [Imports] */

import { Question } from "@common/shared-types";
import { Query } from "firebase-admin/firestore";
import { collection } from "./collection";

/* [Main] */

export async function getAll(complexity?: string, categories?: string[]): Promise<Question[]> {
  let query: Query = collection;

  query = query.where("complexity", "==", complexity);

  if (categories !== undefined) {
    query = query.where("categories", "array-contains-any", categories);
  }

  let snapshot = await collection.get();
  return snapshot.docs as unknown as Question[];
}
