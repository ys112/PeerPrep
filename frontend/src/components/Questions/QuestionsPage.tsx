import {
  Stack,
  Title,
  Button,
  Group,
  Affix,
  Transition,
  rem,
  Text,
} from '@mantine/core';

import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp, IconPlus } from '@tabler/icons-react';
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
