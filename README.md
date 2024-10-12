[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)

# CS3219 Project (PeerPrep) - AY2425S1

**Group: G20**

This is the monorepo for our PeerPrep implementation.

## Development Instructions

Unless otherwise specified, commands should be run in the monorepo's root folder.

### Pre-requisites

- [Node.js](https://nodejs.org/en)
- [Docker](https://docs.docker.com/get-started/get-docker/)
- `pnpm`
  - On Windows, run `npm i -g pnpm` to install it.

### First-time setup

1. Open a command line in the monorepo's root folder and run `pnpm i` to install all dependencies.
    - You do not need to install dependencies individually within subfolders.

### Running the project (development)

1. Run `pnpm dev` to run the dev script.
    - This starts the frontend, user service, and question service in dev mode.
1. Open your browser at <http://localhost:3000>.

### Running the project (production)

1. Run `docker compose up`.
    - This runs Docker containers for the user and question services.
1. In a separate command prompt, run `pnpm dev:frontend` to run the frontend's dev script.
1. Open your browser at <http://localhost:3000>.

## Troubleshooting

### An attempt was made to access a socket in a way forbidden by its access permissions

The following error may be encountered when attempting to `docker compose up` on Windows:

```
Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:3001 -> 0.0.0.0:0: listen tcp 0.0.0.0:3001: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

It may be related to `WinNAT` holding up the port in question, so restarting it may resolve the issue.

Open an **administrator** command prompt and run:

```shell
net stop winnat
net start winnat
```
