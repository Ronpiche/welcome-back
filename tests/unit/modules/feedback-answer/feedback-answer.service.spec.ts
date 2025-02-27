import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { FeedbackAnswerService } from "@modules/feedback-answer/feedback-answer.service";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import type { FeedbackAnswer } from "@modules/feedback-answer/entities/feedback-answer.entity";
import { WelcomeUser } from "@src/modules/welcome/entities/user.entity";
import { Timestamp } from "@google-cloud/firestore";

const feedbackId = "1";
const feedbackQuestionId = "1";
const feedbackAnswer: FeedbackAnswer = {
  _id: "1",
  answers: [],
};
const createFeedbackAnswerDto: string[] = ["a", "b"];

const userId = "user1";
const welcomeUser: WelcomeUser = {
  _id: "user1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  note: "",
  signupDate: "",
  agency: "",
  creationDate: new Timestamp(1,2),
  hrReferent: 
    {
      firstName: "",
      lastName: "",
      email: ""
    }
  ,
  arrivalDate:"", lastUpdate: new Timestamp(1,2), practices:[], steps:[]
};

describe("FeedbackAnswerService", () => {
  let service: FeedbackAnswerService;
  let firestoreService: FirestoreService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        FeedbackAnswerService,
        {
          provide: FirestoreService,
          useValue: {
            getDoc: jest.fn().mockReturnValue(undefined),
            getAllDocuments: jest.fn().mockResolvedValue([feedbackAnswer]),
            getDocument: jest.fn().mockImplementation((collection, id) => {
              if (collection === "WELCOME_USERS") {
                return Promise.resolve(welcomeUser);
              }
              return Promise.resolve(feedbackAnswer);
            }),
            saveDocument: jest.fn().mockResolvedValue(feedbackAnswer),
            updateDocument: jest.fn().mockResolvedValue(feedbackAnswer),
            deleteDocument: jest.fn().mockResolvedValue(undefined),
            deleteCollection: jest.fn().mockResolvedValue(undefined),
            getCollection: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                docs: [
                  {
                    id: "1", // ID of the Feedback document
                    ref: {
                      collection: jest.fn().mockReturnValue({
                        get: jest.fn().mockResolvedValue({
                          docs: [
                            {
                              id: "question1", // ID of the Feedback Question document
                              data: jest.fn().mockReturnValue({
                                label: "Question 1",
                              }),
                              ref: {
                                collection: jest.fn().mockReturnValue({
                                  get: jest.fn().mockResolvedValue({
                                    docs: [
                                      {
                                        id: "user1", // ID of the Feedback Answer document (User's Answer)
                                        data: jest.fn().mockReturnValue({
                                          _id: "user1", // The user's ID
                                          answers: ["Answer 1"], // The user's answers
                                        }),
                                      },
                                    ],
                                  }),
                                }),
                              },
                            },
                          ],
                        }),
                      }),
                    },
                  },
                ],
              }),
            }),
            
            
                  
            
            
          },
        },
      ],
    }).compile();

    service = module.get<FeedbackAnswerService>(FeedbackAnswerService);
    firestoreService = module.get<FirestoreService>(FirestoreService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a feedback answer when createUser is called.", async() => {
      const create = await service.create(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto);
      expect(create).toStrictEqual(feedbackAnswer);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.create(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findAll", () => {
    it("should return a feedback answer array when findAll is called.", async() => {
      const findAll = await service.findAll(feedbackId, feedbackQuestionId);
      expect(findAll).toStrictEqual([feedbackAnswer]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll(feedbackId, feedbackQuestionId));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return a feedback answer when findOne is called.", async() => {
      const findOne = await service.findOne(feedbackId, feedbackQuestionId, feedbackAnswer._id);
      expect(findOne).toStrictEqual(feedbackAnswer);
    });

    it("should throw a NotFound when feedback answer does not exists.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(feedbackId, feedbackQuestionId, feedbackAnswer._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(feedbackId, feedbackQuestionId, feedbackAnswer._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("remove", () => {
    it("should delete a feedback answer when remove is called.", async() => {
      const spy = jest.spyOn(service["firestoreService"], "deleteDocument");
      await service.remove(feedbackId, feedbackQuestionId, feedbackAnswer._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "deleteDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(feedbackId, feedbackQuestionId, feedbackAnswer._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update a feedback answer when update is called.", async() => {
      const update = await service.update(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto);
      expect(update).toStrictEqual(feedbackAnswer);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("getUserAnswers", () => {
    it("should return user answers when getUserAnswers is called.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockResolvedValueOnce(welcomeUser);
      const userAnswers = await service.getUserAnswers(userId);
      expect(userAnswers).toEqual([
        {
          feedbackId: "Nom du collaborateur",
          questionLabel: "John Doe",
          answers: [],
        },
        {
          feedbackId: feedbackId,
          questionLabel: "Question 1",
          answers: ["Answer 1"],
        },
      ]);
    });
  
    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getCollection").mockImplementation(() => {
        throw new InternalServerErrorException();
      });
      const error: InternalServerErrorException = await getError(async() => service.getUserAnswers(userId));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("exportUserAnswersToExcel", () => {
    it("should return an Excel file buffer when exportUserAnswersToExcel is called.", async () => {
      jest.spyOn(service, "getUserAnswers").mockResolvedValue([
        {
          feedbackId: "Nom du collaborateur",
          questionLabel: "John Doe",
          answers: [],
        },
        {
          feedbackId: feedbackId,
          questionLabel: "Question 1",
          answers: ["Answer 1"],
        },
      ]);
      const excelFile = await service.exportUserAnswersToExcel(userId);
      expect(excelFile).toBeInstanceOf(Buffer);
    });

    it("should throw an Error when no answers are found for the user.", async () => {
      jest.spyOn(service, "getUserAnswers").mockResolvedValue([]);
      const error: Error = await getError(async () => service.exportUserAnswersToExcel(userId));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error.message).toBe("No answers found for the user");
    });

    it("should throw an InternalServerError when database fails.", async () => {
      jest.spyOn(service, "getUserAnswers").mockImplementation(() => {
        throw new InternalServerErrorException();
      });
      const error: InternalServerErrorException = await getError(async () => service.exportUserAnswersToExcel(userId));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});