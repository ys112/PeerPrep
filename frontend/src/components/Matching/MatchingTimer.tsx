import { Button, RingProgress, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

interface MatchingTimerProps {
  time: number;
  onTimeout: () => void;
  isMatching: boolean;
}

interface RingProgressSection {
  value: number;
  color: string;
}

function MatchingTimer({
  time = 30,
  onTimeout,
  isMatching,
}: MatchingTimerProps) {
  const [timer, setTimer] = useState<number>(time);
  const [ringProgress, setRingProgress] = useState<RingProgressSection[]>([
    {
      value: 100,
      color: "blue",
    },
  ]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMatching) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
        setRingProgress((arr) =>
          arr.map((section) => ({
            ...section,
            value: section.value - 100 / time,
          }))
        );
      }, 1000);
      setIntervalId(interval);

      const timeoutId = setTimeout(() => {
        // Handle match timeout
        onTimeout();
        clearInterval(intervalId!);
      }, 30000);

      setTimeoutId(timeoutId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isMatching]);

  return (
    <Stack justify="center" align="center">
      <Text fz="h1"> Matching... </Text>
      <RingProgress
        size={200}
        sections={ringProgress}
        label={
          <Text c="blue" ta={"center"} fz="h1">
            {timer}
          </Text>
        }
      ></RingProgress>
      <Button
        fullWidth
        color="red"
        onClick={() => {
          setTimer(time);
          setRingProgress([
            {
              value: 100,
              color: "blue",
            },
          ]);
          clearInterval(intervalId!);
          clearTimeout(timeoutId!);

          {
            /* Handle match cancelation */
          }
          onTimeout();
        }}
      >
        Cancel
      </Button>
    </Stack>
  );
}

export default MatchingTimer;
