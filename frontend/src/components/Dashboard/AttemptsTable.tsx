import { Attempt, ExtractedUser, Question } from '@common/shared-types';
import { Loader, Table, TableData, Text } from '@mantine/core';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { questionClient } from '../../api/questions';
import { roomClient } from '../../api/room';

interface Props {
  user: ExtractedUser;
}

function makeTableData(attempts: Attempt[] | null, questions: Question[] | null): TableData | null {
  if (attempts === null || questions === null) return null;

  return {
    body: attemptsToRows(attempts, questions),
  };
}
function attemptsToRows(attempts: Attempt[], questions: Question[]): string[][] {
  // Sort descending
  let sortedAttempts: Attempt[] = attempts!.sort((a, b) => b.createdAt - a.createdAt);
  return sortedAttempts.map((attempt) => {
    let questionTitle: string = questionIdToTitle(attempt.questionId, questions);
    let prettyTimestamp: string = epochToTimestamp(attempt.createdAt);
    return [questionTitle, prettyTimestamp];
  })
}
function questionIdToTitle(id: string, questions: Question[]): string {
  let matchingQuestions = questions!.filter((question) => question.id === id);

  if (matchingQuestions.length < 1) return "Unknown Question";

  return matchingQuestions[0]!.title;
}
function epochToTimestamp(epoch?: number): string {
  if (epoch === undefined) return "(No Timestamp)";

  let luxonDate: DateTime = DateTime.fromMillis(epoch);
  // https://moment.github.io/luxon/#/formatting
  return `${luxonDate.toFormat("d MMM")} '${luxonDate.toFormat("kk, h:mma").toLowerCase()}`;
}

export function AttemptsTable(props: Props) {
  let [attempts, setAttempts] = useState<Attempt[] | null>(null);
  let [questions, setQuestions] = useState<Question[] | null>(null);

  let tableData: TableData | null = makeTableData(attempts, questions);

  useEffect(() => {
    roomClient.getAttempts(props.user.id)
      .then((fetchedAttempts: Attempt[]) => {
        setAttempts(fetchedAttempts)
        console.log(fetchedAttempts)
      });

    questionClient.getQuestions()
      .then((fetchedQuestions: Question[]) => {
        setQuestions(fetchedQuestions)
        console.log(fetchedQuestions)
      });
  }, [props.user]);

  // [UI]
  if (tableData === null) {
    return <Loader mx='auto' color='lime' />;
  }

  if (tableData.body!.length <= 0) {
    return <Text>You have not collaborated with others yet.</Text>;
  }

  return <Table data={tableData} />;
}
