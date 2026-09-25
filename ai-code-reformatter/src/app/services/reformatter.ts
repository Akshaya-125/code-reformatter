import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReformatResponse, ReformatMode, Language } from '../pages/home/home';

@Injectable({
  providedIn: 'root'
})
export class ReformatterService {

  private apiUrl = 'https://django-ai-service.onrender.com/api/reformat/';

  reformat(code: string, language: Language, mode: ReformatMode): Observable<ReformatResponse> {
    const call = fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, mode })
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      return data as ReformatResponse;
    });

    return from(call).pipe(
      catchError(err => throwError(() => new Error(err.message || 'Failed')))
    );
  }
}