---
title: "Create and Deploy your first GraphQL API with Apollo Server 4, TypeGraphQL, Railway and Render"
date: 2023-06-08
description: "Build a GraphQL API with Apollo Server 4 and TypeGraphQL, then deploy it to Railway and Render."
---

TL;DR
Repo:
https://github.com/emunhoz/graphql-api-with-apollo-server-railway

Client side (React + Vite) consuming our API demo:
https://codesandbox.io/p/sandbox/xenodochial-rain-6pt9ld

**_Update (13/10/2023)_**

Playground in production:
https://graphql-apollo-api-3ybl.onrender.com/

### Intro

In this step-by-step guide, we will learn how to create a GraphQL API from scratch using Apollo Server 4, `type-graphql`, and Railway.

We will explore the necessary steps to set up the development environment, install the relevant dependencies, define resolvers, and finally deploy the API using Railway.

### Initial Configuration

Create a new folder:

```sh
mkdir graphql-api-with-apollo-server-railway
```

Create a `package.json` file:
```sh
cd graphql-api-with-apollo-server-railway && npm init -y
```

Add `typescript`:
```sh
npm install typescript -D
```

Generate a `tsconfig.json` file:
```sh
npx tsc --init
```

We are going to use `tsx` to run local scripts.
```sh
npm install tsx -D
```

_`tsx` is a TypeScript runtime that allows you to run TypeScript files directly without the need for additional build steps during development._

We are going to use `tsup` to build the api.
```sh
npm install tsup -D
```

_`tsup` is a zero-config TypeScript bundler that simplifies the process of building and bundling TypeScript code for deployment._

Add new scripts to `package.json` file:
```json
  // ...
  "scripts": {
    "dev": "tsx src/index.ts",
    "dev:watch": "tsx watch src/index.ts",
    "build": "tsup src",
    "start": "npm run build && node dist/index.js" // `start` command is necessary in order to use Railway
  },
  // ...
```

_These scripts allow you to run the development server, watch for file changes, build the API, and start the production server._

Create an `index.ts` file inside `src`

```ts
// src/index.ts

interface LogProps {
  message: string
}

function log({ message }: LogProps): string {
  console.log(message)
  return message
}

log({ message: 'Hello' })
```

_This is a simple example code that logs a message to the console. It serves as a placeholder to demonstrate the build process._

if you run `npm run build` you will see the `dist` folder:

```js
// dist/index.js

"use strict";

function log({ message }) {
  console.log(message);
  return message;
}
log({ message: "Hello" });
```

_The `npm run build` command transpiles the TypeScript code to JavaScript and outputs the compiled code in the `dist` folder._

Here we finished the initial config!

### Setting up `type-graphql`

The `type-graphql` library allows us to use the "code first" approach instead of the traditional "schema first" approach in GraphQL development. With the "code first" approach, we define our functions and classes first, and then the schema is automatically generated based on those definitions.

This approach offers a more intuitive and convenient way to build GraphQL APIs, as it eliminates the need to write the schema manually and keeps it in sync with the code.

```sh
npm i graphql class-validator type-graphql
```

_These are the necessary dependencies for setting up Apollo Server with `type-graphql`. `graphql` is the core GraphQL library, `class-validator` allows for input validation, and `type-graphql` provides decorators and utilities for building GraphQL schemas and resolvers with TypeScript._


```sh
npm i reflect-metadata
```

_`reflect-metadata` is a package that enables reflection and metadata introspection for TypeScript, which is required by `type-graphql`._

Update the `tsconfig.json` file by adding `lib`, `emitDecoratorMetadata`, `strictPropertyInitialization` and `experimentalDecorators`:

```json
{
  "compilerOptions": {
    "lib": ["es2018", "esnext.asynciterable"],
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false,
    // ...
  }
}
```

_These configuration options enable the necessary features and support for decorators and metadata used by type-graphql._

_If you need, check out the documentation for more: https://typegraphql.com/docs/installation.html_

### Adding `@apollo/server`

Apollo Server is a GraphQL server development framework that makes it easy to create complete GraphQL servers.

Install `@apollo/server`:

```sh
npm install @apollo/server
```

Create a new file `src/main/graphql/apollo/setup.ts`

```ts
// src/main/graphql/apollo/setup.ts

import { ApolloServer } from '@apollo/server'
import { buildSchema } from 'type-graphql'
import { startStandaloneServer } from '@apollo/server/standalone'
import { HelloWorldResolver } from '../resolvers/hello-world'

export async function setupApolloServer() {
  const schema = await buildSchema({
    resolvers: [HelloWorldResolver],
  })

  const server = new ApolloServer({ schema })

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) || 4000 },
  })

  console.log(`🚀 Server ready at ${url}`)
}
```

Then, import the `setupApolloServer` function into the `index.ts` file:

```ts
// src/index.ts

import 'reflect-metadata'
import { setupApolloServer } from './main/graphql/apollo/setup'

async function main() {
  await setupApolloServer()
}

main()
```

### Let's create our first resolver

Create a new file `src/main/graphql/resolvers/hello-world.ts`.
We will convert our `log()` function from `index.ts` into a `resolver`.

```ts
// src/main/graphql/resolvers/hello-world.ts

import { Arg, Query, Resolver } from 'type-graphql'

@Resolver()
export class HelloWorldResolver {
  @Query(() => String)
  async log(@Arg('message', (type) => String) message: string) {
    return `Hey there! This is the message: ${message}`
  }
}
```

Now we are good to go! Run `npm run dev` to open the `Apollo Server Playground`:

![Apollo playground local](/blog/graphql-api-apollo-server-4/image-1.png)

Add the variable `message`:

```json
{
  "message": "My message here!"
}
```

Then run the `Query`. You should receive the following response:

```json
{
  "data": {
    "log": "Hey there! This is the message: My message here!"
  }
}
```

### Deploying with Railway

1 - Go to https://railway.app, log in or create an account, and import your repository via `Github` account.

2 - After importing the project, Railway will start the deployment process automatically.

![Railway app deploying](/blog/graphql-api-apollo-server-4/image-2.png)

3 - To generate a public domain, click on your project name, go to "Settings", "Domain", and click on "Generate domain".

![Generate domain](/blog/graphql-api-apollo-server-4/image-3.png)

Here is an example of the generated domain: https://graphql-railway-api-production.up.railway.app/

_Please note that the query documentation is only available in the local environment. Remember to avoid exposing it in production mode. However, if you want generate the query doc in production, you can try setting up GraphQL Code Generator for documentation generation._

**_Update (13/10/2023)_**

### Deploying using Render

Deploying using Render is easier as deploying with Railway. First, you need to specify your node version:

- https://render.com/docs/node-version

Then, connect to Render with your Github account.

In the `Build & Deploy` follow the commands:

- In the build command use: `npm install`.
- Start Command use: `npm run start`.

Demo: https://graphql-apollo-api-3ybl.onrender.com/

Deploy! Have fun!

### Wrapping up

We now have a ready-to-go production endpoint: https://graphql-railway-api-production.up.railway.app/

In this case, to consume it on the client side, we can configure `@apollo/client`.

I created a simple application using Vite (React) and `@apollo/client` using our production URL API.

Check out this link: https://codesandbox.io/p/sandbox/xenodochial-rain-6pt9ld

Hope you enjoyed it!

---

*Originally published on [dev.to](https://dev.to/emunhoz/create-and-deploy-your-first-graphql-api-with-apollo-server-4-and-railway-2c3b).*
