import { Stack, Text } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Component,
})

function Component() {
  return (
    <Stack>
      <Text fs='italic' fw='bold' ta='center'>Dashboard UI here</Text>
    </Stack>
  )
}
