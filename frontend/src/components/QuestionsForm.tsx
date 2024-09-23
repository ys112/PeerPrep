import {
  Button,
  Modal,
  Select,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { Question, QuestionWithOptional } from "../types/question";

export function QuestionsForm({
  opened,
  selectedQuestion,
  questions,
  onClose,
  submitForm,
}: {
  opened: boolean;
  selectedQuestion?: Question;
  questions: Question[];
  onClose: () => void;
  submitForm: (question: QuestionWithOptional) => void;
}) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      categories: [] as string[],
      complexity: "" as "" | "Easy" | "Medium" | "Hard",
      link: "",
    },
    validate: {
      title: (value: string) =>
        value.trim().length < 2
          ? "Title is required"
          : questions.some(
                (q) =>
                  q.title === value && q.id !== (selectedQuestion?.id ?? q.id)
              ) // Check if title already exists and not the selected question being edited
            ? "Title already exists, possible duplicate question"
            : null,
      description: (value: string) =>
        value.trim().length < 2 ? "Description is required" : null,
      categories: (value: string[]) =>
        value.length < 1 ? "Categories are required" : null,
      complexity: (value: string) =>
        !(value == "Easy" || value == "Medium" || value == "Hard")
          ? "Complexity is required"
          : null,
    },
  });

  // Set form values when editing a question
  useEffect(() => {
    if (selectedQuestion) {
      form.setValues({
        title: selectedQuestion.title,
        description: selectedQuestion.description,
        categories: selectedQuestion.categories,
        complexity: selectedQuestion.complexity,
      });
    }
  }, [selectedQuestion]);

  // Handle form submission and adds existing id if editing a question
  const handleSubmit = (values: QuestionWithOptional) => {
    if (selectedQuestion) {
      values.id = selectedQuestion.id;
    }
    submitForm(values);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      size="lg"
      title={selectedQuestion ? "Edit question" : "Create question"}
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
          <TagsInput
            label="Categories"
            description="Press Enter to submit a category"
            placeholder="Enter categories"
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

          <Button mt="md" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
