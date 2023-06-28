import { Component, Input } from '@angular/core';
import { ReviewDay } from 'src/app/models/web/reviewDay';

@Component({
  selector: 'app-review-day',
  templateUrl: './review-day.component.html',
  styleUrls: ['./review-day.component.scss']
})
export class ReviewDayComponent {
  @Input() day: ReviewDay = new ReviewDay();

  constructor() {}

  getDate(): string {
    let answer = '';
    let months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
      "Aug", "Sep", "Oct", "Nov", "Dec");
    let weekDays = new Array('Sun', 'Mon', 'Tue', 'Wed', "Thu", "Fri", 'Sat');
    if (this.day.day.getDate() < 10) {
      answer += "0";
    }
    answer += `${this.day.day.getDate()} ${months[this.day.day.getMonth()]} `
      + `${this.day.day.getFullYear()} (${weekDays[this.day.day.getDay()]})`;
    return answer;
  }
}
