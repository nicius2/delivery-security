import request from "supertest"
import { prisma } from "@/database/prisma"
import { app } from "@/app"

describe("SessionController", () => {
    let user_id: string

    afterAll(async () => {
        if(user_id) {
            await prisma.user.delete({ where: { id: user_id } })
        }
    })

    it("Should authenticated a and get acess token", async () => {
        const userResponse = await request(app).post("/user").send({
            name: "Auth Test User",
            email: "auth_test_user@gmail.com",
            password: "password123"
        })



        const sessionResponse = await request(app).post("/session").send({
            email: "auth_test_user@gmail.com",
            password: "password123"
        })

        expect(sessionResponse.status).toBe(200)
        expect(sessionResponse.body.token).toEqual(expect.any(String))


        user_id = userResponse.body.id
    })

})