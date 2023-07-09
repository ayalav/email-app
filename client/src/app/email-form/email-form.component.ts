import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

type MailOkResponse = {
  email: String,
  receivedAt: Date
}

type MailErrorResponse = {
  lastValidRequest: Date
}

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent {
  email: string = '';
  receivedTime?: Date;
  errorMessage: string = '';
  
  constructor(private http: HttpClient, private datePipe: DatePipe) { }
  
  isValidEmail(): boolean {
    // Basic email validation using regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(this.email);
  }

  sendEmail() {
    this.receivedTime = undefined; // Reset response time
    this.errorMessage = '';

    if (!this.isValidEmail()) {
      return; // Don't send the request if email is invalid
    }

    this.http.post<any>('https://localhost:5001/api/email/', { email: this.email }).subscribe({
      next: (res: MailOkResponse) => {
        this.receivedTime = res.receivedAt;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 429) {
          const res: MailErrorResponse = error.error;
          const lastReq = this.datePipe.transform(res.lastValidRequest, 'hh:mm:ss')
          this.errorMessage = `Too many requests. Last request at ${lastReq}. Please try again later.`;
        } else {
          this.errorMessage = `An error occurred: ${error.message}`;
        }
      }
    });
  }
}
