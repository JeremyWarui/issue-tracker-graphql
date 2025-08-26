import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();


// import type { Issue, Comment, User } from "./types.ts";
// @ts-ignore
import { issues, users, comments } from "./data.ts";

import { typeDefs } from "./graphql/schemas.ts";
import { resolvers} from "./graphql/resolvers.ts";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

console.log('connecting to MongoDB...');
mongoose.connect(MONGODB_URI).then(() => {
  console.log('connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB: ', error.message);
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    return {
      issues,
      users,
      comments,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
