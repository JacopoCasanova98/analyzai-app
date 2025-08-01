import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ModalComponent {
  @Input() title = '';
  @Input() isOpen = false;
  @Input() logoPath: string = './assets/images/intelligence-dark.png';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
