import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

dotenv.config();


// import type { Issue, Comment, User } from "./types.ts";
// @ts-ignore
import { issues, users, comments } from "./data.ts";

import { typeDefs } from "./graphql/schemas.ts";
import { resolvers } from "./graphql/resolvers.ts";
import { User } from "./models/users.ts";

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
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    let currentUser = null;
    const secretKey = process.env.SECRET_KEY;
    if (auth && auth.startsWith(`Bearer `)) {
      if (!secretKey) {
        throw new Error('SECRET_KEY environment variable is not defined');
      }
      const decodedToken = jwt.verify(
        auth.substring(7), secretKey
      );
      currentUser = await User.findById((decodedToken as { id: string }).id);
    }
    return {
      currentUser,
      issues,
      users,
      comments,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
