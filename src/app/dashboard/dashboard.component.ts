import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule, AsyncPipe } from '@angular/common';import { FormsModule } from '@angular/forms';
import { ZooService } from '../services/zoo.service';
import { Animal, Location, Booking, Member } from '../models/zoo.models';
// material imports for desgin
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
imports: [
    CommonModule, 
    FormsModule, 
    AsyncPipe, 
    MatCardModule, 
    MatButtonModule, 
    MatToolbarModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatSelectModule,
    MatIconModule
  ],  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public zooService = inject(ZooService); // access the RxJS streams directly.
  private platformId = inject(PLATFORM_ID);

  // State Signals
  // RxJS Observable for Animals
  animals$!: Observable<Animal[]>;
  //animals = signal<Animal[]>([]);
  //locations = signal<Location[]>([]);
  visitorCount$ = this.zooService.visitorCount$;
  //visitorCount = signal(0);
  pageLoads = signal(0);
  zooStatus = signal<'open' | 'closed'>('open');
  selectedLocation = signal<Location | null>(null);

  // Feedback Signals
  storageMsg = signal('');
  bookingMsg = signal('');
  membershipMsg = signal('');
  formStatusMsg = signal('');

  //  Local Storage Model
  localAnimal = { species: '', habitat: '', age: null };

  // Add Animal Form Model
  newAnimal = { a_name: '', a_contact: '', a_phone: '' };

  // Membership Form Model for all fields in index.html
  memberData = {
    m_name: '', m_email: '', m_type: '', 
    m_start: '', m_emg_name: '', m_emg_phone: ''
  };

  // Booking Form Model for all teh fields in index.html
  bookingData = {
    b_name: '', b_email: '', b_phone: '', 
    b_animal: '', b_when: '', b_group: 1
  };

  ngOnInit() {
    this.animals$ = this.zooService.getAnimals(); // assing the RxJ dircetly
    //this.zooService.getAnimals().subscribe(data => this.animals.set(data));
    //this.zooService.getLocations().subscribe(data => this.locations.set(data));
    if (isPlatformBrowser(this.platformId)) {
      this.updateSessionCounter();
    }
  }

  toggleZooStatus() {
    this.zooStatus.update(s => s === 'open' ? 'closed' : 'open');
  }

updateVisitors(action: 'increment' | 'decrement') {
    // Now it uses the live RxJS stream from your service!
    this.zooService.updateVisitorsRx(action);
  }

  updateSessionCounter() {
    const loads = Number(sessionStorage.getItem('page_loads') || 0) + 1;
    sessionStorage.setItem('page_loads', loads.toString());
    this.pageLoads.set(loads);
  }

  // Local Storage Logic
  saveLocal() {
    localStorage.setItem('temp_animal', JSON.stringify(this.localAnimal));
    this.storageMsg.set('Animal saved locally!');
  }

  loadLocal() {
    const data = localStorage.getItem('temp_animal');
    if (data) {
      this.localAnimal = JSON.parse(data);
      this.storageMsg.set(`Loaded: ${this.localAnimal.species}`);
    }
  }

  clearLocal() {
    localStorage.removeItem('temp_animal');
    this.localAnimal = { species: '', habitat: '', age: null };
    this.storageMsg.set('Storage cleared');
  }

  // Form Submission placeholders
  onAddAnimal() { this.formStatusMsg.set('Adding animal...'); }
  onMembership() { this.membershipMsg.set('Registration submitted!'); }
  onBooking() { this.bookingMsg.set('Booking submitted!'); }
}