import { Question, QuestionWithOptional } from "../types/question";
import { api } from "./api";

const QUESTION_API_URL = "/questions";

export const getQuestions = async () => {
  try {
    const response = await api.get(QUESTION_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions: ", error);
    throw error;
  }
};

export const addQuestion = async (question: QuestionWithOptional) => {
  try {
    const response = await api.post(QUESTION_API_URL, question);
    console.log("Question added: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding question: ", error);
    throw error;
  }
};

export const editQuestion = async (question: Question) => {
  try {
    const response = await api.put(
      `${QUESTION_API_URL}/${question.id}`,
      question
    );
    console.log("Question edited: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error editing question: ", error);
    throw error;
  }
};

export const deleteQuestion = async (questionId: number) => {
  try {
    const response = await api.delete(`${QUESTION_API_URL}/${questionId}`);
    console.log("Question deleted: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting question: ", error);
    throw error;
  }
};
