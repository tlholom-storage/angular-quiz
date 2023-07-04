import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AnswerType } from 'src/app/types/answer.type';

@Component({
  selector: 'app-quiz-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
})
export class AnswerComponent implements OnInit {
  @Input('answerText') answerTextProps!: string;
  @Input('index') indexProps!: number;
  @Input('isCorrectAnswer') isCorrectAnswerProps!: boolean;
  @Input('isWrongAnswer') isWrongAnswerProps!: boolean;
  @Input('isDisabledAnswer') isDisabledAnswerProps!: boolean;
  @Output('selectAnswer') selectAnswerEvent = new EventEmitter<AnswerType>();

  letterMapping: string[] = ['A', 'B', 'C', 'D'];
  constructor() {}

  ngOnInit() {
    if (!this.answerTextProps || this.indexProps === undefined) {
      throw new Error('Input for answers are not correct');
    }
  }

  @HostListener('click', ['$event'])
  onClick(): void {
    this.selectAnswerEvent.emit(this.answerTextProps);
  }
}
