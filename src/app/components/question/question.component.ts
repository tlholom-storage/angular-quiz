import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { QuizService } from 'src/app/services/Quiz.service';
import { AnswerType } from 'src/app/types/answer.type';
import { QuestionInterface } from 'src/app/types/question.interface';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  question$!: Observable<QuestionInterface>;
  answers$!: Observable<AnswerType[]>;
  correctAnswer: AnswerType | null = null;
  currentAnswer: AnswerType | null = null;
  correctAnswerSubscription!: Subscription;
  currentAnswerSubscription!: Subscription;

  constructor(private quizService: QuizService) {
    this.question$ = this.quizService.state$.pipe(
      map((state) => state.questions[state.currentQuestionIndex])
    );
    this.answers$ = this.quizService.state$.pipe(map((state) => state.answers));
  }

  ngOnInit() {
    this.correctAnswerSubscription = this.question$
      .pipe(map((question) => question.correct_answer!))
      .subscribe((correctAnswer) => (this.correctAnswer = correctAnswer));
    this.currentAnswerSubscription = this.quizService.state$
      .pipe(map((state) => state.currentAnswer))
      .subscribe((currentAnswer) => (this.currentAnswer = currentAnswer));
  }

  onSelectAnswer(answer: AnswerType) {
    this.quizService.selectAnswer(answer);
  }

  isWrongAnswer(answer: AnswerType): boolean {
    if (!this.currentAnswer || !this.correctAnswer) {
      return false;
    }
    return (
      this.currentAnswer === answer && this.currentAnswer !== this.correctAnswer
    );
  }

  isDisabledAnswer(answer: AnswerType): boolean {
    if (!this.currentAnswer || !this.correctAnswer) {
      return false;
    }
    return Boolean(this.currentAnswer);
  }
  isCorrectAnswer(answer: AnswerType): boolean {
    if (!this.currentAnswer || !this.correctAnswer) {
      return false;
    }
    return Boolean(this.currentAnswer) && answer === this.correctAnswer;
  }

  ngOnDestroy(): void {
    this.correctAnswerSubscription.unsubscribe();
    this.currentAnswerSubscription.unsubscribe();
  }
}
