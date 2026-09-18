import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReformatResponse, ReformatMode, Language } from '../pages/home/home';

@Injectable({
  providedIn: 'root'
})
export class ReformatterService {

  // Now pointing to Spring Boot on 8081
  // Spring Boot forwards to Django on 8000
  private apiUrl = 'https://django-ai-service.onrender.com/api/reformat/';

  constructor(private http: HttpClient) {}

  reformat(code: string, language: Language, mode: ReformatMode): Observable<ReformatResponse> {
    const body = { code, language, mode };
    return this.http.post<ReformatResponse>(this.apiUrl, body).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Something went wrong. Please try again.';
    if (error.status === 0) {
      message = 'Cannot connect to server. Is Spring Boot running on port 8081?';
    } else if (error.status === 401) {
      message = 'Please login first.';
    } else if (error.status === 429) {
      message = 'Too many requests. Please wait a moment.';
    } else if (error.error?.message) {
      message = error.error.message;
    }
    return throwError(() => new Error(message));
  }
}