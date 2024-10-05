import { QuestionDoc } from "@common/shared-types";
import { DocumentSnapshot } from "firebase-admin/firestore";

export function docToQuestion(documentSnapshot: DocumentSnapshot) {
	return {
		id: documentSnapshot.id,
		...documentSnapshot.data() as QuestionDoc
	};
}
