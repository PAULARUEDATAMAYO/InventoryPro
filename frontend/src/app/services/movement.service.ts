import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movement {
  id?: number;
  type: string;
  quantity: number;
  date?: string;
  description: string;
  product: {
  id: number;
  name?: string;
};
}

@Injectable({
  providedIn: 'root'
})
export class MovementService {

  private apiUrl = 'http://localhost:8080/api/movements';

  constructor(private http: HttpClient) {}

  getAllMovements(): Observable<Movement[]> {
    return this.http.get<Movement[]>(this.apiUrl);
  }

  createMovement(movement: Movement): Observable<Movement> {
    return this.http.post<Movement>(this.apiUrl, movement);
  }
}