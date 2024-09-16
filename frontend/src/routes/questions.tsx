import { Box, Stack, Text } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/questions')({
  component: Component,
})

function Component() {
  return (
    <Stack>
      <Text fs='italic' fw='bold' ta='center'>Questions UI here</Text>
    </Stack>
  )
}
