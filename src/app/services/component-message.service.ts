import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentMessageService {

  @Output() emiteDato: EventEmitter<any> = new EventEmitter();
  constructor() { }
}
