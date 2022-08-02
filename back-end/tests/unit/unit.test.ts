import { jest } from "@jest/globals"; 
import {faker} from "@faker-js/faker"

import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";


describe("insert recommendations", () => {
    it("create recommendation", async () => {
      const recommendation = {
        name: 'You will Be Back',
        youtubeLink: "https://www.youtube.com/watch?v=eKFN-aqPJH8",
      };
      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValueOnce(null);
  
      jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();
  
      await recommendationService.insert(recommendation);
      expect(recommendationRepository.create).toBeCalledTimes(1);
    });
  
    it("error if the name of the recommendation is not unique", async () => {
      const recommendation = {
        name: 'You will Be Back',
        youtubeLink: "https://www.youtube.com/watch?v=eKFN-aqPJH8",
      };
  
      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValueOnce({ id: 1, ...recommendation, score: 0 });
  
      expect(recommendationService.insert(recommendation)).rejects.toEqual({
        type: "conflict",
        message: "Recommendations names must be unique",
      });
    });
  });

  describe('Up/downvote', () => {
    it('upvote valid id', async () => {
      const recommendation = {
        id: 1,
        name: "Alexander Hamilton",
        youtubeLink: "https://www.youtube.com/watch?v=VhinPd5RRJw"
      };
  
      jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {
          return {
            id: recommendation.id,
            name: recommendation.name,
            youtubeLink: recommendation.youtubeLink,
            score: 0
          };
        });
      jest
        .spyOn(recommendationRepository, "updateScore")
        .mockImplementationOnce((): any => {});
  
      await recommendationService.upvote(recommendation.id);
      expect(recommendationRepository.find).toBeCalled();
      expect(recommendationRepository.updateScore).toBeCalled();
    })

    it('downvote valid id', async () => {
      const recommendationId = 1;
      jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {});
  
      const promise = recommendationService.upvote(recommendationId);
      expect(promise).rejects.toEqual({ type: "not_found", message: "" });
    });
  
    it("Should downvote recommendation", async () => {
      const recommendation = {
        id: 1,
        name: "Alexander Hamilton",
        youtubeLink: "https://www.youtube.com/watch?v=VhinPd5RRJw"
      };
  
      jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {
          return {
            id: recommendation.id,
            name: recommendation.name,
            youtubeLink: recommendation.youtubeLink,
            score: 0
          };
        });
  
      jest
        .spyOn(recommendationRepository, "updateScore")
        .mockImplementationOnce((): any => {
          return {
            id: recommendation.id,
            name: recommendation.name,
            youtubeLink: recommendation.youtubeLink,
            score: -1
          };
        });
  
      jest
        .spyOn(recommendationRepository, "remove")
        .mockImplementationOnce((): any => {});
  
      await recommendationService.downvote(recommendation.id);
      expect(recommendationRepository.find).toBeCalled();
      expect(recommendationRepository.updateScore).toBeCalled();
      expect(recommendationRepository.remove).not.toBeCalled();
    })
  })