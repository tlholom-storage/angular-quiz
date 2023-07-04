import { AnswerType } from "./answer.type";

export interface QuestionInterface {
  question: string,
  incorrect_answers: AnswerType[],
  correct_answer: AnswerType
}
