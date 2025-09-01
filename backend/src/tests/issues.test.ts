import request from "supertest"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "../graphql/schemas.ts"
import { resolvers } from "../graphql/resolvers.ts"
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { generateTestData } from "./helpers/test_data.ts"

process.env.NODE_ENV = "test";


let server: ApolloServer, url: string, mongoServer: MongoMemoryServer;
// jest.setTimeout(20000);

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    await generateTestData()

    server = new ApolloServer({ typeDefs, resolvers })
    const { url: serverUrl } = await startStandaloneServer(server, {
        listen: { port: 0 }
    })
    url = serverUrl;
})

afterAll(async () => {
    await server?.stop()
    await mongoose.disconnect();
    await mongoServer.stop();
})

describe("GraphQL issues API", () => {
    it("fetches all issues", async () => {
        const query = `{
            issues {
                id
                title
                status
            }
        }`
        const response = await request(url).post("/").send({ query });

        expect(response.status).toBe(200)
        expect(response.body.data?.issues).toBeInstanceOf(Array);
        expect(response.body.data.issues.length).toBeGreaterThan(0);
    })

})