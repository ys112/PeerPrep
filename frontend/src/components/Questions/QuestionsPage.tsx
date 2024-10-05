import { Stack, Title, Button, Group, Text } from '@mantine/core';

import { IconPlus } from '@tabler/icons-react';
import { QuestionsForm } from './QuestionsForm';
import { QuestionTable } from './QuestionsTable';
import { modals } from '@mantine/modals';

export function QuestionsPage() {
  return (
    <Stack>
      <Group>
        <Title order={1}>Questions</Title>
        <Button
          variant='gradient'
          ml='auto'
          onClick={() => {
            modals.open({
              title: <Text fw='bold'>Add New Question</Text>,
              children: <QuestionsForm />,
            });
          }}
          leftSection={<IconPlus />}
        >
          Question
        </Button>
      </Group>
      <QuestionTable />
    </Stack>
  );
}
