import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  private apiUrl = 'http://127.0.0.1:8080/api/analyze';

  constructor(private http: HttpClient) {}

  analyzeText(text: string) {
    return this.http.post(this.apiUrl, { text });
  }
}