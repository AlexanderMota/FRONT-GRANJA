import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private stringsUrl = '../../assets/textos/strings.json';
  private stringsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  strings$: Observable<any> = this.stringsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStrings();
  }

  private loadStrings(): void {
    this.http.get<any>(this.stringsUrl).pipe(
      catchError(error => {
        console.error('Error loading localization strings:', error);
        return [];
      })
    ).subscribe(data => {
      this.stringsSubject.next(data);
    });
  }

  getString(key: string): Observable<string> {
    return this.strings$.pipe(
      map(strings => {
        if (!strings) {
          return ''; // Devuelve una cadena vacía si los datos no están disponibles aún
        }
        const keys = key.split('.'); // Divide la clave en un arreglo de claves
        // Recorre cada clave para acceder al elemento correspondiente en el objeto de cadenas
        let value = strings;
        for (const k of keys) {
          if (!value.hasOwnProperty(k)) {
            return ''; // Devuelve una cadena vacía si no se encuentra la clave
          }
          value = value[k];
        }
        return value || ''; // Devuelve el valor encontrado o una cadena vacía si es nulo
      })
    );
  }
  getArray(key: string): Observable<string[]> {
    return this.strings$.pipe(
      map(strings => this.getArrayValue(strings, key))
    );
  }
  private getArrayValue(strings: any, key: string): string[] {
    const value = this.getValue(strings, key);
    return Array.isArray(value) ? value : [];
  }
  private getValue(strings: any, key: string): string {
    const keys = key.split('.'); // Divide la clave en un arreglo de claves
    // Recorre cada clave para acceder al elemento correspondiente en el objeto de cadenas
    let value = strings;
    for (const k of keys) {
      if (!value.hasOwnProperty(k)) {
        return ''; // Devuelve una cadena vacía si no se encuentra la clave
      }
      value = value[k];
    }
    return value || ''; // Devuelve el valor encontrado o una cadena vacía si es nulo
  }
}