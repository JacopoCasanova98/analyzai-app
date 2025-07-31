import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { AnalysisService } from '../../services/analysis/analysis.service';
import { HistoryService } from '../../services/history/history.service';
import { SharedService } from '../../services/text-shared.service';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, TextFieldModule],
  template: `
    <form (ngSubmit)="submit()" [formGroup]="textForm" class="form-container">
      <textarea
        matInput
        cdkTextareaAutosize
        #autosize="cdkTextareaAutosize"
        formControlName="text"
        placeholder="insert text to analyze..."
        class="text-area"
        cdkAutosizeMinRows="5"
        cdkAutosizeMaxRows="10"
        (keydown.enter)="submit(); $event.preventDefault()"
      ></textarea>

      <div class="toolbar">
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="textForm.invalid"
        >
          Analyze
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      width: 90vw;         
      max-width: 1200px;    
      height: auto;
      max-height: 700px;   
      box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
      border-radius: 12px;
      background: white;
      padding: 1rem;
      box-sizing: border-box;
    }

    .text-area {
      resize: none;
      border-radius: 8px;
      border: 1px solid #ccc;
      padding: 0.75rem;
      font-size: 1.1rem;
      font-family: inherit;
      box-sizing: border-box;
      width: 100%;
      overflow: auto; 
      transition: border-color 0.3s;
    }

    .text-area:focus {
      border-color: #3f51b5;
      outline: none;
    }

    .toolbar {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .toolbar {
        justify-content: center;
      }
    }
  `]
})
export class TextInputComponent {

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @Output() showResponse = new EventEmitter();

  textForm = new FormGroup({
    text: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private analysisService: AnalysisService,
    private historyService: HistoryService,
    private sharedService: SharedService
  ) {
    this.sharedService.fillText$.subscribe(text => {
      this.textForm.get('text')?.setValue(text);
    });
  }

  submit(): void {
    const text = this.textForm.get('text')?.value;
    if (!text) return;
  
    this.analysisService.analyzeText(text).subscribe({
      next: (response) => {
        this.showResponse.emit(response);
  
        setTimeout(() => {
          this.historyService.refreshHistory();
        }, 200);
      },
      error: (error) => console.error(error),
    });
  }
}
