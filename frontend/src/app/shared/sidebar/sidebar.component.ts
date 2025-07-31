import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, AnalysisDTO } from '../../services/history/history.service';
import { AuthService } from '../../auth/services/auth.service';
import { MatListModule } from '@angular/material/list';
import { SharedService } from '../../services/text-shared.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule],
  template: `
    <mat-nav-list *ngIf="history.length > 0" class="history-list">
        <mat-list-item *ngFor="let item of history" class="history-item" (click)="onListItemClicked(item)">
          <div class="text-content">
            <div class="main-text">{{ item.text }}</div>
            <small class="timestamp">{{ item.createdAt | date:'short' }}</small>
          </div>
        </mat-list-item>
    </mat-nav-list>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() itemClicked = new EventEmitter<string>();

  history: AnalysisDTO[] = [];

  constructor(private historyService: HistoryService, private authService: AuthService, private sharedService: SharedService ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLogged => {
      if (isLogged) {
        this.historyService.loadHistory().subscribe(); 
        this.historyService.history$.subscribe(data => {
          this.history = data;
        });
      } else {
        this.history = [];
      }
    });
  }

  onListItemClicked(item: AnalysisDTO) {
    this.sharedService.fillText(item.text);
  }

}
