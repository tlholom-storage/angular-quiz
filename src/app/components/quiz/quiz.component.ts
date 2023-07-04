import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { QuizService } from 'src/app/services/Quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  questionsLength$!: Observable<number>;
  currentQuestionIndex$!: Observable<number>;
  showResult$!: Observable<boolean>;
  countAnswerCount$!: Observable<number>;

  constructor(public quizService: QuizService) {
    this.questionsLength$ = this.quizService.state$.pipe(
      map((state) => state.questions.length)
    );
    this.currentQuestionIndex$ = this.quizService.state$.pipe(
      map((state) => state.currentQuestionIndex + 1)
    );
    this.showResult$ = this.quizService.state$.pipe(
      map((state) => state.showResults)
    );
    this.countAnswerCount$ = this.quizService.state$.pipe(
      map((state) => state.countAnswerCount)
    );
  }

  ngOnInit() {
    this.quizService.getQuestions();
  }

  nextQuestion() {
    this.quizService.nextQuestion();
  }

  restart(): void {
    this.quizService.restartQuiz();
  }
}
