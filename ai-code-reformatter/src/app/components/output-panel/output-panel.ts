import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReformatResponse } from '../../pages/home/home';

@Component({
  selector: 'app-output-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './output-panel.html',
  styleUrl: './output-panel.scss'
})
export class OutputPanelComponent {

  @Input() response: ReformatResponse | null = null;
  @Input() loading = false;
  @Input() error = '';

  copied = false;

  async copyOutput(): Promise<void> {
    if (!this.response?.reformattedCode) return;
    await navigator.clipboard.writeText(this.response.reformattedCode);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1500);
  }

  get reductionLabel(): string {
    if (!this.response) return '';
    const r = this.response.reductionPercent;
    if (r > 0) return `↓ ${r}% shorter`;
    if (r < 0) return `↑ ${Math.abs(r)}% expanded`;
    return 'Same length';
  }

  get reductionClass(): string {
    if (!this.response) return '';
    return this.response.reductionPercent > 0 ? 'badge--success' : 'badge--info';
  }
}