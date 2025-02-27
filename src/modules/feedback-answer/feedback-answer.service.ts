import { Injectable } from "@nestjs/common";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { FeedbackAnswer } from "@modules/feedback-answer/entities/feedback-answer.entity";
import * as xlsx from 'xlsx'; 
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



  public async  getUserAnswers(userId) {
    // Get all feedback documents
    const feedbackRef = this.firestoreService.getCollection(FIRESTORE_COLLECTIONS.FEEDBACKS);
    const feedbackSnapshot = await feedbackRef.get();

    const user = await this.firestoreService.getDocument<WelcomeUser>(FIRESTORE_COLLECTIONS.WELCOME_USERS, userId);
    const fullName = `${user.firstName} ${user.lastName}`;
  
    // Initialize an array to hold the user's answers
    let userAnswers = [];

    // Add user name as the first element in bold
       userAnswers.push({
        feedbackId: "Nom du collaborateur",
        questionLabel: fullName, // Make it bold (assuming markdown export)
        answers: [], // Empty answers
      });
  
    // Loop through each feedback document
    for (const feedbackDoc of feedbackSnapshot.docs) {
      const feedbackId = feedbackDoc.id;
      
      // Get all the questions for the current feedback
      const questionsRef = feedbackDoc.ref.collection(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS);
      const questionsSnapshot = await questionsRef.get();
      
      // Loop through each question document
      for (const questionDoc of questionsSnapshot.docs) {
        const questionLabel = questionDoc.data().label;
  
        // Get the answers for the current question
        const answersRef = questionDoc.ref.collection(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS);
        const answersSnapshot = await answersRef.get();
        // Loop through each answer document and check if it matches the user's ID
        answersSnapshot.docs.forEach((answerDoc) => {
          if (answerDoc.data()._id === userId) {
            // If the answer is from the user, add it to the results
            userAnswers.push({
              feedbackId: feedbackId,
              questionLabel: questionLabel,
              answers: answerDoc.data().answers,  // The array of answers
            });
          }
        });
      }
    }
  
    // Return all answers from the user across all feedbacks
    return userAnswers;
  }

  public async exportUserAnswersToExcel(userId: string): Promise<void> {
      try {
        // Get the user's answers
        const userAnswers = await this.getUserAnswers(userId);
   
        if (userAnswers.length === 0) {
          throw new Error("No answers found for the user");
        }
    
        // Prepare the data to be written to Excel
        const formattedAnswers = userAnswers.map((answer) => ({
          FeedbackID: answer.feedbackId,
          QuestionLabel: answer.questionLabel,
          Answers: answer.answers.join(', '),  // Convert the array of answers to a comma-separated string
        }));
    
        
        // Convert the data to a worksheet
        const ws = xlsx.utils.json_to_sheet(formattedAnswers);

        ws['!cols'] = [
          { wch: 25 },  // FeedbackID column width
          { wch: 100 },  // QuestionLabel column width (increase for longer questions)
          { wch: 60 },  // Answers column width (increase for longer answers)
          ];
    
        // Create a new workbook and append the worksheet
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'User Feedback Answers');
    
        // Generate the Excel file and send it to the user
        const excelFile = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
    
        // Save the file or send it to the client
        // For example, you could use NestJS response to download the file:
        return excelFile;
      } catch (error) {
        console.error('Error exporting answers:', error);
        if (error.message === "No answers found for the user") {
          throw error;
        }
        throw new Error('Failed to export answers');
      }
    }
}