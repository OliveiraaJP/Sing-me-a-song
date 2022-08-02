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

export async function searchMusic(youtubeLink: any) {
    return await prisma.recommendation.findFirst({where: {youtubeLink}})
}

export async function insert3MusicOnDb(){
    await prisma.recommendation.createMany({data: [
        {name: 'Rewrite the stars', youtubeLink: 'https://www.youtube.com/watch?v=yO28Z5_Eyls'},
        {name: 'Never enough', youtubeLink: 'https://www.youtube.com/watch?v=GLK-mr8JmNY'},
        {name: 'From now on', youtubeLink: 'https://www.youtube.com/watch?v=XyIDxpUJ10Q'}
    ]})
}
