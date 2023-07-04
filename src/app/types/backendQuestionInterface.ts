
import { AnswerType } from "./answer.type"

export interface BackendQuestionInterface {
  question: string,
  incorrect_answers: AnswerType[],
  correct_answer: AnswerType
}

