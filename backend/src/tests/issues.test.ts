import request from "supertest"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "../graphql/schemas.ts"
import { resolvers } from "../graphql/resolvers.ts"
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { generateTestData } from "./helpers/test_data.ts"
import { assertObjectType } from "graphql/type/index.js";
import { User } from "../models/users.ts";

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

    it("fetches issues with comments array", async () => {
        const query = `{
            issues {
                id
                assignedTo {
                    id
                }
                comments {
                    id
                }
            }
        }
        `
        const response = await request(url).post("/").send({ query });

        expect(response.status).toBe(200);
        expect(response.body.data?.issues[0]?.comments).toBeInstanceOf(Array)
        expect(response.body.data?.issues[0]?.comments.length).toBeGreaterThanOrEqual(0)
    })


    it("fetches issues with assignedTo of first issue to be null", async () => {
        const query = `{
            issues {
                id
                assignedTo {
                    id
                }
            }
        }
        `
        const response3 = await request(url).post("/").send({ query });

        expect(response3.status).toBe(200);
        // expect(Object.keys(response3.body.data?.issues[0]?.assignedTo)).toContain("id")
        expect(response3.body.data?.issues[0]?.assignedTo).toBeDefined()
        expect(response3.body.data?.issues[0]?.assignedTo).toEqual(null)
    })

})
