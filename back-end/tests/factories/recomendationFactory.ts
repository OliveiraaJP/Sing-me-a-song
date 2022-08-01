import { Recommendation } from "@prisma/client";
import { prisma } from "../../src/database";

type RecomendationData = Omit<Recommendation, 'id' | 'score'>



export function getLinkMusic() {
    const music: RecomendationData = {
        name: 'Hino do flamengo',
        youtubeLink: 'https://www.youtube.com/watch?v=vpdFip3Es0o'
    }
    return music
}

export function getFakeLinkMusic() {
    const fakeMusic: RecomendationData = {
        name: 'wrongData',
        youtubeLink: 'ThisShouldBeYoutubeURL.com'
    }
    return fakeMusic
}

export async function postMusicOnDb(){
    const music: RecomendationData = {
        name: 'Hino do flamengo',
        youtubeLink: 'https://www.youtube.com/watch?v=vpdFip3Es0o'
    }
    const response = await prisma.recommendation.create({data: music})
    return response
}

export async function searchMusic(youtubeLink) {
    return await prisma.recommendation.findFirst({where: {youtubeLink}})
}