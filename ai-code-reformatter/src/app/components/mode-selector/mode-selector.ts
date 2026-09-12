import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReformatMode } from '../../pages/home/home';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mode-selector.html',
  styleUrl: './mode-selector.scss'
})
export class ModeSelectorComponent {

  @Input() selected: ReformatMode = 'shorten';
  @Output() modeChange = new EventEmitter<ReformatMode>();

  modes = [
    { id: 'shorten' as ReformatMode, label: 'Shorten',     desc: 'Make code shorter'         },
    { id: 'minify'  as ReformatMode, label: 'Minify',       desc: 'Collapse to minimum'        },
    { id: 'clean'   as ReformatMode, label: 'Clean up',     desc: 'Fix style and formatting'   },
    { id: 'comment' as ReformatMode, label: 'Add comments', desc: 'Explain code with comments' },
  ];

  select(mode: ReformatMode): void {
    this.modeChange.emit(mode);
  }
}