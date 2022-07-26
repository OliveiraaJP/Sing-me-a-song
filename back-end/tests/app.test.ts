import { prisma } from "../src/database.js";
import supertest from "supertest";
import app from "../src/app.js";
import * as recommendationFactory from "./factories/recomendationFactory.js"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("POST/recommendation", () => {
    it("Post a valid music", async () => {
        const music = recommendationFactory.getLinkMusic()
        const response = await supertest(app).post(`/recommendations`).send(music)
        expect(response.statusCode).toBe(201)
    })

    it("Post a invalid music should return 422", async () => {
        const music = recommendationFactory.getFakeLinkMusic()
        const response = await supertest(app).post(`/recommendations`).send(music)
        expect(response.statusCode).toBe(422)
    })
})

describe("GET/recommendation", () => {
    it("Get musics valid statusCode 200",async () => {
        const getMusic = await supertest(app).get(`/recommendations`)
        console.log(getMusic.body);
        expect(getMusic.statusCode).toBe(200)
    })

    it("Get musics with music on DB valid body not empty - length != 0",async () => {
        await recommendationFactory.postMusicOnDb()
        const getMusic = await supertest(app).get(`/recommendations`)
        expect(getMusic.body.length).not.toBe(0)
    })

    it("Get musics w/o music on DB valid body IS empty - length = 0",async () => {
        const getMusic = await supertest(app).get(`/recommendations`)
        expect(getMusic.body.length).toBe(0)
    })

})


afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
    await prisma.$disconnect()
})