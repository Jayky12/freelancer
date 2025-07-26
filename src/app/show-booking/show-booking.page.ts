import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceTypeService } from '../service-type.service';
import { Router } from '@angular/router';
import { NavController ,AlertController} from '@ionic/angular';

interface Booking {
  booking_id: number;
  user_id: '';
  service_id: '';
  service_name: '';
  price: number;
  booking_date: '';
  booking_time: '';
  status:'';
}
@Component({
  selector: 'app-show-booking',
  templateUrl: './show-booking.page.html',
  styleUrls: ['./show-booking.page.scss'],
  standalone: false,
})

export class ShowBookingPage implements OnInit {
  bookings: Booking[] = [];
  userId: string | null = null;
  constructor(private serviceTypeService: ServiceTypeService,private http: HttpClient, private router: Router, private navCtrl: NavController,private alertController: AlertController) { }

  ngOnInit() {
    this.userId = localStorage.getItem('user_id');
        if (this.userId) {
            this.fetchBookings();
        } else {
            console.error('ไม่ได้ login');
            this.router.navigate(['/login']);
        }
  }
  fetchBookings() {
    this.http.get<Booking[]>(`http://localhost:3000/api/bookings/user/${this.userId}`) // ใช้ endpoint ใหม่
        .subscribe({
            next: (data) => {
                this.bookings = data;
            },
            error: (error) => {
                console.error('ดึงข้อมูลไม่สำเร็จ:', error);
            }
        });
}
}

