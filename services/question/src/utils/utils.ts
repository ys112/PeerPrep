import { QuestionDoc } from "@common/shared-types";

export function docToQuestion(documentSnapshot: FirebaseFirestore.QueryDocumentSnapshot) {
	return {
		id: documentSnapshot.id,
		...documentSnapshot.data() as QuestionDoc
	};
}
