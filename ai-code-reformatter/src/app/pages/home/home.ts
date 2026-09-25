import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';
import { ModeSelectorComponent } from '../../components/mode-selector/mode-selector';
import { CodeEditorComponent } from '../../components/code-editor/code-editor';
import { OutputPanelComponent } from '../../components/output-panel/output-panel';
import { ReformatterService } from '../../services/reformatter';
import { HistoryService } from '../../services/history';

export type ReformatMode = 'shorten' | 'minify' | 'clean' | 'comment';
export type Language = 'Python' | 'JavaScript' | 'TypeScript' | 'Java' | 'C++' | 'Go' | 'Rust' | 'SQL';

export interface ReformatResponse {
  reformattedCode: string;
  inputLines: number;
  outputLines: number;
  inputChars: number;
  outputChars: number;
  reductionPercent: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    ModeSelectorComponent,
    CodeEditorComponent,
    OutputPanelComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  language: Language = 'JavaScript';
  mode: ReformatMode = 'shorten';
  inputCode = '';
  response: ReformatResponse | null = null;
  loading = false;
  error = '';

  languages: Language[] = [
    'Python', 'JavaScript', 'TypeScript',
    'Java', 'C++', 'Go', 'Rust', 'SQL'
  ];

  constructor(
    private reformatterService: ReformatterService,
    private historyService: HistoryService
  ) {}

  reformat(): void {
    if (!this.inputCode.trim()) return;
    this.loading = true;
    this.error = '';
    this.response = null;

    this.reformatterService.reformat(
      this.inputCode,
      this.language,
      this.mode
    ).subscribe({
      next: (res) => {
        this.response = res;
        this.loading = false;
        this.historyService.addEntry(
          this.language, this.mode,
          this.inputCode, res.reformattedCode,
          res.reductionPercent
        );
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  clear(): void {
    this.inputCode = '';
    this.response = null;
    this.error = '';
  }

  loadSample(): void {
    this.response = null;    
  this.error = ''; 
  this.loading = false;
    const samples: Partial<Record<Language, string>> = {
      JavaScript: `function getUserData(userId) {
    return new Promise(function(resolve, reject) {
        var url = 'https://api.example.com/users/' + userId;
        fetch(url).then(function(response) {
            if (response.ok === true) { return response.json(); }
            else { reject(new Error('Failed')); }
        }).then(function(data) {
            var result = {};
            result.id = data.id;
            result.name = data.name;
            resolve(result);
        }).catch(function(error) { reject(error); });
    });
}`,
      Python: `def calculate_discount(price, pct, is_member, is_weekend):
    discounted = price
    if pct > 0:
        discounted = price - price * (pct / 100)
    if is_member == True:
        discounted = discounted - discounted * 0.05
    if is_weekend == True:
        discounted = discounted - discounted * 0.03
    final_price = round(discounted, 2)
    return final_price`,
      Java: `public class Calculator {
    public int add(int a, int b) { int result = a + b; return result; }
    public int subtract(int a, int b) { int result = a - b; return result; }
    public double divide(int a, int b) {
        if (b == 0) { throw new ArithmeticException("Cannot divide by zero"); }
        double result = (double) a / (double) b;
        return result;
    }
}`
    };
    this.inputCode = samples[this.language] || samples['JavaScript']!;
  }

  get inputLines(): number {
    return this.inputCode ? this.inputCode.split('\n').length : 0;
  }

  get inputChars(): number {
    return this.inputCode.length;
  }
}