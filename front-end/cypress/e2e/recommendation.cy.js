/// <reference types="cypress" />
/* eslint-disable */

describe('empty spec', () => {

    beforeEach(() => {
        //cy.resetRec()
        //cy.request("POST", "http://localhost:5000/recommendations/reset", {});
    })

    it('End to end', () => {
        const rec = {
            name:'Lolipop',
            youtubeLink: 'https://www.youtube.com/watch?v=2IH8tNQAzSs'
        }

        cy.visit('http://localhost:3000')
        cy.get('#name').type(rec.name)
        cy.get('#placeholder').type(rec.youtubeLink)

        cy.intercept("POST", "http://localhost:5000/recommendations").as("createRecommendation");
        cy.get("button").click();
        cy.wait("@createRecommendation");

        cy.contains(rec.name);
    })
})
