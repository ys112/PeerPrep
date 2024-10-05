import { Question } from '@common/shared-types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  ActionIcon,
  Badge,
  Group,
  Loader,
  Paper,
  Spoiler,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { QuestionsForm } from './QuestionsForm';
import { api } from '../../api/client';

const COMPLEXITY_COLOR_MAP: Record<Question['complexity'], string> = {
  Easy: 'green',
  Medium: 'orange',
  Hard: 'red',
};

function stringToHexColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate the RGB values and form the color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }

  return color;
}

export function QuestionTable() {
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      try {
        return await api.questionClient.getQuestions();
      } catch (error) {
        notifications.show({
          color: 'red',
          title: 'Error fetching questions',
          message: `${(error as Error).message}`,
        });
        console.error(error);
        throw error;
      }
    },
    initialData: [],
  });

  const { mutateAsync: deleteQuestionMutation } = useMutation({
    mutationFn: async (id: string) => {
      try {
        return await api.questionClient.deleteQuestion(id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: ({ id }) => {
      notifications.show({
        color: 'green',
        message: 'Successfully deleted question',
      });
      queryClient.setQueryData<Question[]>(['questions'], (prev) =>
        prev?.filter((question) => question.id !== id)
      );
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Error deleteing questions',
        message: `${(error as Error).message}`,
      });
    },
  });

  if (isLoading) {
    return (
      <Stack>
        <Loader mx='auto' />
        <Text ta='center'>Loading questions...</Text>
      </Stack>
    );
  } else {
    const rows = questions.map((question, index) => (
      <Table.Tr>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td maw={100} fw='bold'>
          {question.title}
        </Table.Td>
        <Table.Td maw={540}>
          <Spoiler
            fz='sm'
            className='whitespace-pre-wrap'
            maxHeight={110}
            showLabel='...'
            hideLabel='Hide'
          >
            {question.description}
          </Spoiler>
        </Table.Td>
        <Table.Td>
          <Stack gap={2} align='flex-start'>
            {question.categories.map((category) => (
              <Badge size='sm' autoContrast bg={stringToHexColor(category)}>
                {category}
              </Badge>
            ))}
          </Stack>
        </Table.Td>
        <Table.Td>
          <Text c={COMPLEXITY_COLOR_MAP[question.complexity]}>
            {question.complexity}
          </Text>
        </Table.Td>
        <Table.Td>
          <Group wrap='nowrap'>
            <ActionIcon
              variant='light'
              onClick={() => {
                modals.open({
                  title: <Text fw='bold'>Editing Question</Text>,
                  children: (
                    <QuestionsForm
                      initialValues={{
                        ...question,
                      }}
                    />
                  ),
                });
              }}
            >
              <IconEdit />
            </ActionIcon>
            <ActionIcon
              variant='light'
              color='red'
              onClick={() => {
                modals.openConfirmModal({
                  title: `Please confirm your action`,
                  children: (
                    <Text>You are about to delete "{question.title}"</Text>
                  ),
                  labels: { confirm: 'Delete', cancel: 'Cancel' },
                  confirmProps: { color: 'red' },
                  onConfirm: async () => {
                    await deleteQuestionMutation(question.id);
                  },
                });
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

    return (
      <Paper shadow='md' p='lg' withBorder>
        <Table highlightOnHover stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Th>#</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Complexity</Table.Th>
            <Table.Th></Table.Th>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    );
  }
}
