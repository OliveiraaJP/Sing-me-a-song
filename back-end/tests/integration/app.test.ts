import { prisma } from "../../src/database.js";
import supertest from "supertest";
import app from "../../src/app.js";
import {Recommendation} from "@prisma/client"
import * as recommendationFactory from "../factories/recomendationFactory.js"


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

    it("Post a duplicate name should return 409", async () => {
        const music = recommendationFactory.getLinkMusic()
        await supertest(app).post(`/recommendations`).send(music)
        const response = await supertest(app).post(`/recommendations`).send(music)
        expect(response.statusCode).toBe(409)
    })
})

describe("GET/recommendation", () => {
    it("Get recommendation valid statusCode 200",async () => {
        const getMusic = await supertest(app).get(`/recommendations`)
        console.log(getMusic.body);
        expect(getMusic.statusCode).toBe(200)
    })

    it("Get recommendation with music on DB valid body not empty - length != 0",async () => {
        await recommendationFactory.postMusicOnDb()
        const getMusic = await supertest(app).get(`/recommendations`)
        expect(getMusic.body.length).not.toBe(0)
    })

    it("Get recommendation w/o music on DB valid body IS empty - length = 0",async () => {
        const getMusic = await supertest(app).get(`/recommendations`)
        expect(getMusic.body.length).toBe(0)
    })

})

describe('GET/random', () => {
    it("Randomize w/o musics should return 404" , async () => {
        const response = await supertest(app).get(`/recommendations/random`)
        expect(response.statusCode).toBe(404)
    })
    it("Randomize w/ musics" , async () => {
        const music = recommendationFactory.getLinkMusic()
        await supertest(app).post(`/recommendations`).send(music)
        const response = await supertest(app).get(`/recommendations/random`)
        expect(response.body).toMatchObject(music)
    })
})

describe('POST/:id/', () => {
    it('Upvote', async () => {
        const require = await recommendationFactory.postMusicOnDb()
        const response = await supertest(app).post(`/recommendations/${require.id}/upvote`)
        expect(response.statusCode).toBe(200)
        const music = await recommendationFactory.searchMusic(response.body.youtubeLink)
        expect(music.score).toBe(1)
    })

    it('Downvote', async () => {
        const require = await recommendationFactory.postMusicOnDb()
        const response = await supertest(app).post(`/recommendations/${require.id}/downvote`)
        expect(response.statusCode).toBe(200)
        const music = await recommendationFactory.searchMusic(response.body.youtubeLink)
        expect(music.score).toBe(-1)
    })

    it("given invalid id, should return 404", async () => {
        const response = await supertest(app).post(`/recommendations/17/downvote`);
    
        expect(response.status).toBe(404);
      });
})

describe('GET/top/:amount', () => {
    it("get top3 songs",async () => {
        await recommendationFactory.insert3MusicOnDb()
    })
})


afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
    await prisma.$disconnect()
})