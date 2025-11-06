import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatatableService {
  private readonly _textFilter = new BehaviorSubject<string>('')
  textFilter$: Observable<string> = this._textFilter.asObservable()

  constructor() {}

  setTextFilter(textFilter: string) {
    this._textFilter.next(textFilter)
  }
}
