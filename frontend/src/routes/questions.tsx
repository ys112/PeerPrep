import {
  Box,
  Stack,
  Title,
  Table,
  ScrollArea,
  Button,
  ActionIcon,
  Group,
} from "@mantine/core";

import { IconPencil, IconTrash } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import cx from "clsx";
import classes from "./questions.module.css";
import { QuestionsForm } from "../components/QuestionsForm";
import { useDisclosure } from "@mantine/hooks";
import { dummyData } from "../data/dummyData";
import {
  // NewQuestion,
  Question,
  QuestionWithOptionalId,
} from "../types/question";

export const Route = createFileRoute("/questions")({
  component: QuestionComponent,
});

function QuestionComponent() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [opened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [questions, setQuestions] = useState<Question[]>(dummyData);
  const [existingQuestion, setExistingQuestion] = useState<
    Question | undefined
  >(undefined);

  function submitForm(question: QuestionWithOptionalId) {
    closeForm();

    if ("id" in question) {
      // Update existing question in list
      setQuestions((prevQuestions) => {
        return prevQuestions.map((q) =>
          q.id === question.id ? (question as Question) : q
        );
      });
    } else {
      // Add new question to list
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: questions.length + 1,
          ...question,
        },
      ]);
    }
  }

  function openEditQuestionForm(row: Question) {
    setExistingQuestion(row);
    openForm();
  }

  function deleteQuestion(id: number): void {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  }

  function handleCloseForm() {
    setExistingQuestion(undefined);
    closeForm();
  }

  const rows = questions.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>{row.categories}</Table.Td>
      <Table.Td>{row.complexity}</Table.Td>
      <Table.Td>
        <a href={row.link} target="_blank" rel="noopener noreferrer">
          {row.link}
        </a>
      </Table.Td>
      <Table.Td>
        {/* Edit and delete buttons */}
        <ActionIcon onClick={() => openEditQuestionForm(row)}>
          <IconPencil />
        </ActionIcon>
        <ActionIcon color="red" onClick={() => deleteQuestion(row.id)}>
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
        existingQuestion={existingQuestion}
        onClose={handleCloseForm}
        submitForm={submitForm}
      />

      <ScrollArea
        h="70dvh"
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
              <Table.Th>Link</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}
