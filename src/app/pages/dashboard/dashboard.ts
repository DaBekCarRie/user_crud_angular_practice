import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private userService = inject(UserService);
  displayedColumns: string[] = ['userId', 'fullName', 'emailId', 'role'];
  data = signal<User[]>([]);
  totalRecords = signal(0);
  pageSize = 20;
  pageNumber = 1;
  searchText: string = '';
  // private subscription = new Subscription();
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.fetchData(this.pageNumber, this.pageSize);
  }
  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(500), 
        distinctUntilChanged() 
      )
      .subscribe((value) => {
        this.searchText = value;
    this.fetchData(this.pageNumber, this.pageSize,this.searchText);

      });
  }
  fetchData(page: number, size: number, searchTerm?: string) {
    this.userService.getUsers(page, size, searchTerm).subscribe((res) => {
      this.data.set(res.data || []);
      this.totalRecords.set(res.totalRecords || 0);
    });
  }
  onSearchChange(term: string) {
    console.log(term);
    this.searchText = term;
    this.searchSubject.next(term);
  }
  clearSearch() {
    this.searchText = '';
    this.searchSubject.next('');
  }
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchData(this.pageNumber, this.pageSize,this.searchText);
  }

  logout() {
    localStorage.removeItem('token');
    location.href = '/login'; // simple redirect after logout
  }
}
