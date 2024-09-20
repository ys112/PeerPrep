import {
  Button,
  Modal,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { Question, QuestionWithOptionalId } from "../types/question";

export function QuestionsForm({
  opened,
  existingQuestion,
  onClose,
  submitForm,
}: {
  opened: boolean;
  existingQuestion?: Question;
  onClose: () => void;
  submitForm: (question: QuestionWithOptionalId) => void;
}) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      categories: "",
      complexity: "",
      link: "",
    },
  });

  useEffect(() => {
    if (existingQuestion) {
      form.setValues({
        title: existingQuestion.title,
        description: existingQuestion.description,
        categories: existingQuestion.categories,
        complexity: existingQuestion.complexity,
        link: existingQuestion.link,
      });
    }
  }, [existingQuestion]);

  const handleSubmit = (values: QuestionWithOptionalId) => {
    if (existingQuestion) {
      values.id = existingQuestion.id;
    }
    submitForm(values);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      size="lg"
      title={existingQuestion ? "Edit question" : "Create question"}
      styles={{ title: { fontWeight: "bold", fontSize: "1.5rem" } }}
      opened={opened}
      onClose={handleClose}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter the title of the question"
            key={form.key("title")}
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Enter the question description"
            autosize
            minRows={3}
            key={form.key("description")}
            {...form.getInputProps("description")}
          />
          <TextInput
            label="Categories"
            placeholder="Enter the categories involved"
            key={form.key("categories")}
            {...form.getInputProps("categories")}
          />
          <Select
            label="Complexity"
            placeholder="Select the complexity"
            data={["Easy", "Medium", "Hard"]}
            key={form.key("complexity")}
            {...form.getInputProps("complexity")}
          />
          <TextInput
            label="Link"
            placeholder="Enter the link"
            key={form.key("link")}
            {...form.getInputProps("link")}
          />
          <Button mt="md" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
