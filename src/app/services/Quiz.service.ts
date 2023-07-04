import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { QuizStateInterface } from '../types/quizState.interface';
import { AnswerType } from '../types/answer.type';
import { QuestionInterface } from '../types/question.interface';
import { HttpClient } from '@angular/common/http';
import { BackendQuestionInterface } from '../types/backendQuestionInterface';
@Injectable({
  providedIn: 'root',
})
export class QuizService {
  initialState: QuizStateInterface = {
    questions: [],
    currentQuestionIndex: 0,
    showResults: false,
    countAnswerCount: 0,
    answers: [],
    currentAnswer: null,
  };

  state$ = new BehaviorSubject<QuizStateInterface>({
    ...this.initialState,
  });

  constructor(private httpClient: HttpClient) {}

  selectAnswer(answer: AnswerType): void {
    const state = this.getState();
    const newCorrectAnswerCount =
      answer === state.questions[state.currentQuestionIndex].correct_answer
        ? state.countAnswerCount + 1
        : state.countAnswerCount;
    this.setState({
      currentAnswer: answer,
      countAnswerCount: newCorrectAnswerCount,
    });
  }

  setState(partialState: Partial<QuizStateInterface>): void {
    this.state$.next({ ...this.state$.getValue(), ...partialState });
  }

  getState(): QuizStateInterface {
    return this.state$.getValue();
  }
  nextQuestion(): void {
    const state = this.getState();
    const newShowReults =
      state.currentQuestionIndex === state.questions.length - 1;
    const newCurrentQuestionIndex = newShowReults
      ? state.currentQuestionIndex
      : state.currentQuestionIndex + 1;
    const newAnswers = newShowReults
      ? []
      : this.shuffleAnswers(state.questions[newCurrentQuestionIndex]);
    this.setState({
      currentQuestionIndex: newCurrentQuestionIndex,
      showResults: newShowReults,
      answers: newAnswers,
      currentAnswer: null,
    });
  }
  shuffleAnswers(questions: QuestionInterface): AnswerType[] {
    const unshaffledAnswers = [
      ...questions.incorrect_answers,
      questions.correct_answer,
    ];
    return unshaffledAnswers
      .map((unshaffledAnswer) => ({
        sort: Math.random(),
        value: unshaffledAnswer,
      }))
      .sort((a, b) => a.sort - b.sort)
      .map((el) => el.value);
  }

  restartQuiz(): void {
    this.setState(this.initialState);
    this.getQuestions();
  }
  apiUrl =
    'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple&encode=url3986';
  getQuestions(): void {
    this.httpClient
      .get<{ results: BackendQuestionInterface[] }>(this.apiUrl)
      .pipe(map((response) => response.results))
      .subscribe((questions) => {
        this.loadQuestions(questions);
      });
  }

  loadQuestions(questionsToBeLoaded: BackendQuestionInterface[]) {
    const normalizeQuestions = this.normalizeQuestions(questionsToBeLoaded);
    const initialAnswers = this.shuffleAnswers(normalizeQuestions[0]);
    this.setState({ questions: normalizeQuestions, answers: initialAnswers });
  }

  normalizeQuestions(
    backendquestions: BackendQuestionInterface[]
  ): QuestionInterface[] {
    return backendquestions.map(
      (backendquestions: BackendQuestionInterface) => {
        const incorrectAnswers = backendquestions.incorrect_answers.map(
          (backendinorrectAnswer) => {
            return decodeURIComponent(backendinorrectAnswer);
          }
        );
        return {
          question: decodeURIComponent(backendquestions.question),
          correct_answer: decodeURIComponent(backendquestions.correct_answer),
          incorrect_answers: incorrectAnswers,
        } as QuestionInterface;
      }
    );
  }
}
