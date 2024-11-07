import { Attempt } from '@common/shared-types';
import { FieldPath, Query, QueryDocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { db } from './clients';

/* [Main] */

async function queryToAttempts(query: Query): Promise<Attempt[]> {
  let querySnapshot: QuerySnapshot = await query.get();
  let docSnapshots: QueryDocumentSnapshot[] = querySnapshot.docs;

  return docSnapshots as unknown as Attempt[];
}

/* [Exports] */

async function getAttempts(userId: string): Promise<Attempt[]> {
  let query: Query = db;
	query = query.where(
		new FieldPath('userMatchDoneData', 'userIds'),
		'array-contains',
		userId
	);

  return queryToAttempts(query);
}

let model = {
  getAttempts
};
export default model;
