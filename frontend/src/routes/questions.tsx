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
import { notifications } from "@mantine/notifications";

import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import cx from "clsx";
import classes from "./questions.module.css";
import { QuestionsForm } from "../components/QuestionsForm";
import { Question, QuestionWithOptional } from "../types/question";
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "../service/questionsService";

export const Route = createFileRoute("/questions")({
  component: QuestionComponent,
});

/**
 * Wraps API response with notification
 *
 * @param {Function} [finallyFunction] - Optional function to call in the finally block
 */
function handleQuestionApiCall(
  QuestionApiCall: Promise<any>,
  successMsg: string,
  errorMsg: string,
  finallyFunction?: Function
): void {
  QuestionApiCall.then((data) => {
    // Show success message
    notifications.show({
      title: successMsg,
      message: "",
      color: "green",
    });
  })
    .catch((error) => {
      // Show error message
      notifications.show({
        title: errorMsg,
        message: "",
        color: "red",
      });
    })
    .finally(() => {
      if (finallyFunction) {
        finallyFunction();
      }
    });
}

function QuestionComponent() {
  const [scrolled, setScrolled] = useState<boolean>(false);
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

      handleQuestionApiCall(
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

      handleQuestionApiCall(
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
    handleQuestionApiCall(
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

  // Map questions to table rows
  const rows = questions.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>
        <Pill.Group size="md" bd="2">
          {row.categories.map((category, index) => (
            <Pill
              styles={{
                root: {
                  border: "1px solid black",
                },
              }}
              key={index}
            >
              {category}
            </Pill>
          ))}
        </Pill.Group>
      </Table.Td>
      <Table.Td>
        <Badge
          color={
            row.complexity == "Easy"
              ? "green"
              : row.complexity == "Medium"
                ? "orange"
                : "red"
          }
        >
          {row.complexity}
        </Badge>
      </Table.Td>
      <Table.Td>
        {/* Edit and delete buttons */}
        <ActionIcon onClick={() => openEditQuestionForm(row)}>
          <IconPencil />
        </ActionIcon>
        <ActionIcon color="red" onClick={() => handleDeleteQuestion(row)}>
          <IconTrash />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

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

      <ScrollArea
        h="80dvh"
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table bgcolor="#f3f3fe" miw="50dvw">
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Topic</Table.Th>
              <Table.Th>Complexity</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}
