import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss'
})
export class CodeEditorComponent {

  @Input() value = '';
  @Input() placeholder = 'Paste your code here...';
  @Input() label = 'Input code';
  @Output() valueChange = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  get lineCount(): number {
    return this.value ? this.value.split('\n').length : 0;
  }

  get charCount(): number {
    return this.value.length;
  }

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLTextAreaElement).value);
  }

  clear(): void {
    this.valueChange.emit('');
    this.cleared.emit();
  }

  async paste(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.valueChange.emit(text);
    } catch {
      // user can paste manually with Ctrl+V
    }
  }
}