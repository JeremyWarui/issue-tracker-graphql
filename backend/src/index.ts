import { ApolloServer } from "@apollo/server";
import { startStandaloneServer} from "@apollo/server/standalone";

const typeDefs = `
    type Query {
      dummy: String!
    }
`

const resolvers = {
    Query: {
        dummy: (): string => "Hello, GraphQL"
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${ url }`)