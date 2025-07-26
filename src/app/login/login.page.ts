import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  user_name = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}
  ngOnInit() {}

  login() {
    this.errorMessage = '';

    this.http.post<any>('http://localhost:3000/api/login', {
      user_name: this.user_name,
      password: this.password,
    }).subscribe({
      next: (data) => {
        localStorage.setItem('user_id', data.user_id);
        this.router.navigate(['/home']);
      },
      error: (error) => {

        console.error('Error:', error);
        this.errorMessage = error.error.message || 'เกิดข้อผิดพลาดในการล็อกอิน';
      }
    });
  }
}
