import { Injectable } from '@angular/core';
import { ReformatMode, Language } from '../pages/home/home';

export interface ReformatHistory {
  id: number;
  language: Language;
  mode: ReformatMode;
  inputCode: string;
  outputCode: string;
  reductionPercent: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private readonly STORAGE_KEY = 'reformat_history';
  private readonly MAX_ENTRIES = 20;

  getHistory(): ReformatHistory[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  addEntry(
    language: Language,
    mode: ReformatMode,
    inputCode: string,
    outputCode: string,
    reductionPercent: number
  ): void {
    const history = this.getHistory();
    const entry: ReformatHistory = {
      id: Date.now(),
      language,
      mode,
      inputCode,
      outputCode,
      reductionPercent,
      createdAt: new Date()
    };
    history.unshift(entry);
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(history.slice(0, this.MAX_ENTRIES))
    );
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}