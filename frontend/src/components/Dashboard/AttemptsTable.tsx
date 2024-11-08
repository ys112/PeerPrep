import { Attempt, ExtractedUser, Question } from '@common/shared-types';
import { Loader, Table, TableData, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { questionClient } from '../../api/questions';
import { roomClient } from '../../api/room';

interface Props {
  user: ExtractedUser;
}

export function AttemptsTable(props: Props) {
  let [attempts, setAttempts] = useState<Attempt[] | null>(null);
  let [questions, setQuestions] = useState<Question[] | null>(null);

  let tableData: TableData | null = makeTableData()
  function makeTableData(): TableData | null {
    if (attempts === null || questions === null) return null;

    return {
      body: attemptsToRows(),
    };

    function attemptsToRows(): string[][] {
      function questionIdToTitle(id: string) {
        let matchingQuestions = questions!.filter((question) => question.id === id);

        if (matchingQuestions.length < 1) return "Unknown Question"

        return matchingQuestions[0]!.title;
      }

      return attempts!.map(attempt => {
        return [questionIdToTitle(attempt.questionId)]
      })
    }
  }

  useEffect(() => {
    roomClient.getAttempts(props.user.id)
      .then((fetchedAttempts: Attempt[]) => {
        // Reverse sort, docs are presumably appended
        setAttempts(fetchedAttempts.reverse())
        console.log(fetchedAttempts)
      })

    questionClient.getQuestions()
      .then((fetchedQuestions: Question[]) => {
        setQuestions(fetchedQuestions)
        console.log(fetchedQuestions)
      })
  }, [props.user])

  // [UI]
  if (tableData === null) {
    return <Loader mx='auto' color='lime' />;
  }

  if (tableData.body!.length <= 0) {
    return <Text>You have not collaborated with others yet.</Text>
  }

  return <Table data={tableData} />;
}
