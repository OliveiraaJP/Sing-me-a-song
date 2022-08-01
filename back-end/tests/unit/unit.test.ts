import { jest } from "@jest/globals"; 
import {faker} from "@faker-js/faker"

import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";


describe("insert recommendations", () => {
    it("should create recommendation", async () => {
      const recommendation = {
        name: faker.lorem.words(4),
        youtubeLink: "https://www.youtube.com/watch?v=eKFN-aqPJH8",
      };
      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValueOnce(null);
  
      jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();
  
      await recommendationService.insert(recommendation);
      expect(recommendationRepository.create).toBeCalledTimes(1);
    });
  
    it("should throw a conflict error if the name of the recommendation is not unique", async () => {
      const recommendation = {
        name: faker.lorem.words(3),
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