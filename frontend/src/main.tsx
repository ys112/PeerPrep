import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

// Set up a Router instance
const router = createRouter({
  routeTree,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  )
}
