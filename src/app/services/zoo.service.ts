import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal, Location, Booking, Member } from '../models/zoo.models';

@Injectable({ providedIn: 'root' })
export class ZooService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Data Fetching -paths to match server.js routes
getAnimals(): Observable<Animal[]> { 
    return this.http.get<Animal[]>(`${this.apiUrl}/animals`); 
  }
  
  getLocations(): Observable<Location[]> { 
    return this.http.get<Location[]>(`${this.apiUrl}/locations`); 
  }
  
  getVisitorCount(): Observable<{ count: number }> { 
    return this.http.get<{ count: number }>(`${this.apiUrl}/visitors`); 
  }

  updateVisitors(action: 'increment' | 'decrement'): Observable<{count: number}> {
    return this.http.post<{count: number}>(`${this.apiUrl}/visitors/${action}`, {});
  }
  submitBooking(data: Booking): Observable<any> {
    return this.http.post(`${this.apiUrl}/booking`, data);
  }

  submitMembership(data: Member): Observable<any> {
    return this.http.post(`${this.apiUrl}/membership`, data);
  }
}