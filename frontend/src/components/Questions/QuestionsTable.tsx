import { Table, Pill, Badge, ActionIcon, ScrollArea } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Question } from "../../types/question";
import classes from "./QuestionsTable.module.css";
import { QuestionsForm } from "./QuestionsForm";
import { useState } from "react";
import cx from "clsx";

interface QuestionTableProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
}

export function QuestionTable({
  questions,
  onEdit,
  onDelete,
}: QuestionTableProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);

  const rows = questions.map((row, index) => (
    <Table.Tr key={row.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td className={classes.whitespace}>{row.description}</Table.Td>
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
        <ActionIcon onClick={() => onEdit(row)}>
          <IconPencil />
        </ActionIcon>
        <ActionIcon color="red" onClick={() => onDelete(row)}>
          <IconTrash />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    /* Adapted from mantine components: https://ui.mantine.dev/category/tables/ */
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
  );
}
