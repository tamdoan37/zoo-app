import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs'; import { Animal, Location, Booking, Member } from '../models/zoo.models';

@Injectable({ providedIn: 'root' })
export class ZooService {
  private http = inject(HttpClient);
  //private apiUrl = 'https://localhost:7203/api';  //for local tsting
  private apiUrl = 'https://zoo-api-dotnet.onrender.com/api'; // for hosting on render
  //reflecting the visitor count in real-time using a BehaviorSubject
  private visitorSubject = new BehaviorSubject<number>(0);
  public visitorCount$ = this.visitorSubject.asObservable();

  // Sort animals by name before returning
  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/animals`).pipe(
      map(animals => animals.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`);
  }

  getVisitorCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/visitors`);
  }

// update the visitor count in real-time using RxJS BehaviorSubject
  updateVisitorsRx(action: 'increment' | 'decrement') {
    const current = this.visitorSubject.value;
    this.visitorSubject.next(action === 'increment' ? current + 1 : Math.max(0, current - 1));
  }
  submitBooking(data: Booking): Observable<any> {
    return this.http.post(`${this.apiUrl}/booking`, data);
  }

  submitMembership(data: Member): Observable<any> {
    return this.http.post(`${this.apiUrl}/membership`, data);
  }
}