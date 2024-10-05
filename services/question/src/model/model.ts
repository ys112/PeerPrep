import { Question, QuestionDoc } from '@common/shared-types';
import { DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import logger from "../utils/logger";
import { collection } from './collection';

/* [Main] */

async function queryToQuestions(query: Query): Promise<Question[]> {
  let querySnapshot: QuerySnapshot = await query.get();
  let docSnapshots: QueryDocumentSnapshot[] = querySnapshot.docs;

  return docSnapshots.map(docSnapshotToQuestion);
}

async function docReferenceToQuestion(docReference: DocumentReference): Promise<Question | null> {
  let docSnapshot = await docReference.get();

  if (!docSnapshot.exists) {
    return null;
  }
  return docSnapshotToQuestion(docSnapshot);
}

function docSnapshotToQuestion(docSnapshot: DocumentSnapshot): Question {
	return {
		id: docSnapshot.id,
		...docSnapshot.data() as QuestionDoc
	};
}

/* [Exports] */

export async function getAll(complexity?: string, categories?: string[]): Promise<Question[]> {
  let query: Query = collection;
  if (categories !== undefined) {
    query = query.where('complexity', '==', complexity);
  }
  if (categories !== undefined) {
    query = query.where('categories', 'array-contains-any', categories);
  }

  return queryToQuestions(query);
}

export async function get(id: string): Promise<Question | null> {
  let docReference: DocumentReference = collection.doc(id);

  return docReferenceToQuestion(docReference);
}

export async function getByTitle(title: string): Promise<Question | null> {
  let query: Query = collection.where('title', '==', title);

  let questions: Question[] = await queryToQuestions(query);

  if (questions.length <= 0) {
    return null;
  }

  if (questions.length > 1) {
    logger.warn("Potential duplicates found! Multiple questions have the same title.");
    logger.warn(JSON.stringify(questions));
  }
  return questions[0];
}

export async function create(questionDoc: QuestionDoc): Promise<Question> {
  let docReference: DocumentReference = await collection.add(questionDoc);

  return (await docReferenceToQuestion(docReference)) as Question;
}
