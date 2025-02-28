import { Injectable } from "@nestjs/common";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { FeedbackAnswer } from "@modules/feedback-answer/entities/feedback-answer.entity";
import * as xlsx from "xlsx";
import { WelcomeUser } from "../welcome/entities/user.entity";

@Injectable()
export class FeedbackAnswerService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(
    id: string,
    questionId: string,
    userId: string,
    answers: string[],
  ): Promise<FeedbackAnswer> {
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);

    return this.firestoreService.saveDocument(
      FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS,
      { _id: userId, answers },
      parentDoc,
    );
  }

  public async findAll(id: string, questionId: string): Promise<FeedbackAnswer[]> {
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);

    return this.firestoreService.getAllDocuments<FeedbackAnswer>(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS, undefined, parentDoc);
  }

  public async findOne(id: string, questionId: string, userId: string): Promise<FeedbackAnswer> {
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);

    return this.firestoreService.getDocument<FeedbackAnswer>(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS, userId, parentDoc);
  }

  public async update(id: string, questionId: string, userId: string, answers: string[]): Promise<FeedbackAnswer> {
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);
    await this.findOne(id, questionId, userId);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS, userId, { answers }, parentDoc);
  }

  public async remove(id: string, questionId: string, userId: string): Promise<void> {
    await this.findOne(id, questionId, userId);
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS, userId, parentDoc);
  }

  public async getUserAnswers(userId): Promise<any[]> {
    const feedbackRef = this.firestoreService.getCollection(FIRESTORE_COLLECTIONS.FEEDBACKS);
    const feedbackSnapshot = await feedbackRef.get();

    const user = await this.firestoreService.getDocument<WelcomeUser>(FIRESTORE_COLLECTIONS.WELCOME_USERS, userId);
    const fullName = `${user.firstName} ${user.lastName}`;
  
    // initialize an array to hold the user's answers
    const userAnswers = [];

    // add user name as the first element in bold
    userAnswers.push({
      feedbackId: "Nom du collaborateur",
      questionLabel: fullName, // make it bold (assuming markdown export)
      answers: [], // empty answers
    });
  
    for (const feedbackDoc of feedbackSnapshot.docs) {
      const feedbackId = feedbackDoc.id;
      
      const questionsRef = feedbackDoc.ref.collection(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS);
      const questionsSnapshot = await questionsRef.get();

      for (const questionDoc of questionsSnapshot.docs) {
        const questionLabel = questionDoc.data().label;
        const answersRef = questionDoc.ref.collection(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS);
        const answersSnapshot = await answersRef.get();
        answersSnapshot.docs.forEach(answerDoc => {
          if (answerDoc.data()._id === userId) {
            userAnswers.push({
              feedbackId,
              questionLabel,
              answers: answerDoc.data().answers,
            });
          }
        });
      }
    }
    return userAnswers;
  }

  public async exportUserAnswersToExcel(userId: string): Promise<void> {
    try {
      // get the user's answers
      const userAnswers = await this.getUserAnswers(userId);
  
      if (userAnswers.length === 0) {
        throw new Error("No answers found for the user");
      }
  
      // prepare the data to be written to Excel
      const formattedAnswers = userAnswers.map(answer => ({
        FeedbackID: answer.feedbackId,
        QuestionLabel: answer.questionLabel,
        Answers: answer.answers.join(", "), // convert the array of answers to a comma-separated string
      }));
        
      // convert the data to a worksheet
      const ws = xlsx.utils.json_to_sheet(formattedAnswers);

      ws["!cols"] = [
        { wch: 25 }, // feedbackID column width
        { wch: 100 }, // questionLabel column width (increase for longer questions)
        { wch: 60 }, // answers column width (increase for longer answers)
      ];
  
      // create a new workbook and append the worksheet
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "User Feedback Answers");
  
      // generate the Excel file and send it to the user
      const excelFile = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });
  
      // save the file or send it to the client
      return excelFile;
    } catch (error) {
      if (error.message === "No answers found for the user") {
        throw error;
      }
      throw new Error("Failed to export answers");
    }
  }
}