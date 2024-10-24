import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss'
})
export class InstructionsComponent {
  @Output() closeInstructions = new EventEmitter<void>();

  steps = [
    {
      title: 'Step 1: Prepare Information and Register Pet',
      description: 'Gather pet details:',
      items: [
        'Name',
        'Type of pet',
        'Age and breed',
        'Special markings'
      ]
    },
    {
      title: 'Step 2: Take Photos',
      description: 'Required photos:',
      items: [
        'Full-body shot',
        'Face close-up',
        'Unique features',
        'And upload photos to gallery'
      ]
    },
    {
      title: 'Step 3: Go to Gallery',
      description: 'Upload and go to gallery:',
      items: [
        'Go to gallery for view photos',
        'Click on buttom gallery from the card',
      ]
    }
  ];

  close() {
    this.closeInstructions.emit();
  }
}
