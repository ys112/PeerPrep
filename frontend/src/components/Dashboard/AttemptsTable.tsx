import { Attempt, ExtractedUser } from '@common/shared-types';
import { Loader, Table, TableData } from '@mantine/core';
import { useEffect, useState } from 'react';
import { roomClient } from '../../api/room';

interface Props {
  user: ExtractedUser;
}

function attemptsToRows(attempts: Attempt[] | null) {
  if (attempts === null) return []

  return attempts.map(attempt => [attempt.questionId])
}

export function AttemptsTable(props: Props) {
  let [attempts, setAttempts] = useState<Attempt[] | null>(null);

  const tableData: TableData = {
    head: ['Question'],
    body: attemptsToRows(attempts),
  };

  useEffect(() => {
    roomClient.getAttempts(props.user.id).then((loadedAttempts) => {
      setAttempts(loadedAttempts)
      console.log(loadedAttempts)
    })
  }, [props.user])

  // [UI]
  if (attempts === null) {
    return <Loader mx='auto' color='lime' />;
  }

  return <Table data={tableData} />;
}
