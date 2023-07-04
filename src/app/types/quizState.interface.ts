import { AnswerType } from "./answer.type";
import { QuestionInterface } from "./question.interface";

export interface QuizStateInterface {
  questions: QuestionInterface[],
  currentQuestionIndex: number,
  showResults: boolean,
  countAnswerCount: number,
  answers: AnswerType[],
  currentAnswer: AnswerType | null
}
