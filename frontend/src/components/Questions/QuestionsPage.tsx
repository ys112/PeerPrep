import React, { useEffect, useState } from "react";
import {
  Stack,
  Title,
  Table,
  ScrollArea,
  Button,
  ActionIcon,
  Group,
  PillGroup,
  Pill,
  Badge,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { QuestionsForm } from "./QuestionsForm";
import { QuestionTable } from "./QuestionsTable";
import { Question, QuestionWithOptional } from "../../types/question";
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "../../service/questionsService";
import { handleApiCall } from "../../utils/handleApiCall";

export function QuestionsPage() {
  const [opened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<
    Question | undefined
  >(undefined);

  // Fetch questions on component mount
  useEffect(() => {
    refreshQuestions();
  }, []);

  // Get questions from API
  function refreshQuestions() {
    getQuestions().then((data?: Question[]) => {
      setQuestions(data || []);
    });
  }

  // Handles form submisison for adding and editing questions
  function submitForm(question: QuestionWithOptional) {
    closeForm();

    if ("id" in question) {
      // Update existing question in list
      setQuestions((prevQuestions) => {
        return prevQuestions.map((q) =>
          q.id === question.id ? (question as Question) : q
        );
      });

      handleApiCall(
        editQuestion(question as Question),
        `Successfully modified question: ${question.title}`,
        "Error updating question",
        refreshQuestions
      );
    } else {
      // Add new question to list
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: questions.length + 1,
          ...question,
        } as Question,
      ]);

      handleApiCall(
        addQuestion(question as QuestionWithOptional),
        `Successfully added question: ${question.title}`,
        "Error adding question",
        refreshQuestions
      );
    }

    setSelectedQuestion(undefined);
  }

  // Opens form with selected question data
  function openEditQuestionForm(question: Question) {
    setSelectedQuestion(question);
    openForm();
  }

  // Handles deleting of selected question through API
  function handleDeleteQuestion(question: Question): void {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== question.id)
    );
    handleApiCall(
      deleteQuestion(question.id),
      `Successfully deleted question: ${question.title}`,
      "Error deleting question",
      refreshQuestions
    );
  }

  function handleCloseForm() {
    setSelectedQuestion(undefined);
    closeForm();
  }

  return (
    <Stack>
      <Group>
        <Title ta="center">Questions</Title>
        <Button
          variant="gradient"
          gradient={{ from: "blue", to: "violet", deg: 90 }}
          ml="auto"
          onClick={openForm}
        >
          Add Questions
        </Button>
      </Group>
      <QuestionsForm
        opened={opened}
        selectedQuestion={selectedQuestion}
        questions={questions}
        onClose={handleCloseForm}
        submitForm={submitForm}
      />
      <QuestionTable
        questions={questions}
        onEdit={openEditQuestionForm}
        onDelete={handleDeleteQuestion}
      />
    </Stack>
  );
}
