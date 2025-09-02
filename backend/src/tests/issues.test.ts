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

    it("fetches users", async () => {
        const query = `{
            users {
                id
            }
        }
        `
        const response4 = await request(url).post("/").send({ query });

        expect(response4.status).toBe(200);
        expect(response4.body.data?.users).toBeInstanceOf(Array)
        expect(response4.body.data?.users.length).toEqual(3)
    })

    it("fetches users that one is assigned to issue", async () => {
        const queryUsers = `{
            users {
                id
            }
        }
        `
        const queryIssues = `{
            issues {
                id
                assignedTo {
                    id
                }
            }
        }`
        const usersResponse = await request(url).post("/").send({ query: queryUsers });
        const issuesResponse = await request(url).post("/").send({ query: queryIssues });

        expect(usersResponse.status).toBe(200);
        expect(issuesResponse.status).toBe(200);

        const users = usersResponse.body.data?.users.map((u:any)=> u.id)
        const assignedUserId = issuesResponse.body.data?.issues[1].assignedTo?.id

        expect(users).toContain(assignedUserId)
    })

    describe("Test Mutations", () => {
        it("adds a new user", async() => {

            const response = await request(url).post("/").send(
              { query: `mutation {
                    createUser(name: "John Doe", email: "johndoe@gmail.com", hashPwd:"test1234") {
                        id
                        name
                        email
                    }
                }
              `}
            )

            const queryUsers = `{
                users {
                    id
                }
            }
            `

            const responseUsers = await request(url).post("/").send({ query: queryUsers })

            expect(response.status).toBe(200)
            expect(responseUsers.body.data?.users?.length).toEqual(4)
        })

        it("throws error if adding an existing user", async() => {

            const validResponse = await request(url).post("/").send(
              { query: `mutation {
                    createUser(name: "John Doe", email: "johndoe@gmail.com", hashPwd:"test1234") {
                        id
                        name
                        email
                    }
                }
              `}
            )

            const validResponse2 = await request(url).post("/").send(
              { query: `mutation {
                    createUser(name: "John Doe", email: "johndoe@gmail.com", hashPwd:"test1234") {
                        id
                        name
                        email
                    }
                }
              `}
            )

            const queryUsers = `{
                users {
                    id
                }
            }
            `
            const responseUsers = await request(url).post("/").send({ query: queryUsers })

            expect(validResponse.status).toBe(200)
            expect(validResponse2.status).toBe(200)
            expect(validResponse2.body.errors[0]?.message).toMatch("name must be unique")
            expect(responseUsers.body.data?.users.length).toEqual(4)
        })

        it("adds a new issue", async() => {

            const responseIssue = await request(url).post("/").send(
              { query: `mutation {
                    createIssue(title: "Broken codebase", description: "Git commit creates a conflict during merging") {
                        id
                        title
                        description
                        assignedTo {
                            id
                        }
                    }
                }
              `}
            )

            const issues = `{
                issues {
                    id
                    assignedTo {
                        id
                    }
                }
            }`


            const response = await request(url).post("/").send({ query: issues })

            expect(responseIssue.status).toBe(200)
            expect(response.status).toBe(200)
            expect(response.body.data?.issues?.length).toEqual(3)
        })

        it("throws error if issue has no title", async() => {

            const issuesBefore = await request(url).post("/").send({
                query: `{ issues { id } }`,
            });

            const countBefore = issuesBefore.body.data?.issues?.length;


            const responseIssue = await request(url).post("/").send(
              { query: `mutation {
                    createIssue(title: "", description: "Git commit creates a conflict during merging") {
                        description
                        assignedTo {
                            id
                        }
                    }
                }
              `}
            )


            const issuesAfter = await request(url).post("/").send({
                query: `{ issues { id } }`,
            });

            const countAfter = issuesAfter.body.data?.issues?.length;

            expect(issuesAfter.status).toBe(200)
            expect(responseIssue.status).toBe(200)
            expect(responseIssue.body.errors[0].message).toMatch("title and description is required")
            expect(countAfter).toEqual(countBefore)
        })
    })
})

