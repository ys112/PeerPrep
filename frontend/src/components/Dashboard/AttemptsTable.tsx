import { Attempt, ExtractedUser } from '@common/shared-types';
import { Loader, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { roomClient } from '../../api/room';

interface Props {
  user: ExtractedUser;
}

export function AttemptsTable(props: Props) {
  let [attempts, setAttempts] = useState<Attempt[] | null>(null);

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

  return <Text>{ JSON.stringify(attempts) }</Text>
}
