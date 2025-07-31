import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private fillTextSubject = new Subject<string>();
  fillText$ = this.fillTextSubject.asObservable();

  fillText(text: string) {
    this.fillTextSubject.next(text);
  }
}
