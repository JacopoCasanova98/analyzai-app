import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { tap } from 'rxjs/operators';

export interface AnalysisDTO {
  id: number;
  text: string;
  emotion: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private apiUrl = 'http://localhost:8080/api/analyze';

  private historySubject = new BehaviorSubject<AnalysisDTO[]>([]);
  public history$ = this.historySubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  loadHistory(): Observable<AnalysisDTO[]> {
    const token = this.authService.getToken();
    if (!token) {
      this.historySubject.next([]);
      return of([]);
    }

    return this.http.get<AnalysisDTO[]>(`${this.apiUrl}/history`).pipe(
      tap(history => this.historySubject.next(history))
    );
  }

  refreshHistory(): void {
    this.loadHistory().subscribe();
  }
}
