import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceTypeService } from '../service-type.service';
import { Router } from '@angular/router';
import { NavController ,AlertController} from '@ionic/angular';
import * as moment from 'moment';
@Component({
    selector: 'app-booking',
    templateUrl: './booking.page.html',
    styleUrls: ['./booking.page.scss'],
    standalone: false,
})
export class BookingPage implements OnInit {
    serviceId: string | null = null;
    service: any=[];
    bookingData = {
      user_id: '',
      service_id: '',
      booking_date: '',
      booking_time: '',
      status: 1,
    };

    constructor(private serviceTypeService: ServiceTypeService,private http: HttpClient, private router: Router, private navCtrl: NavController,private alertController: AlertController) { }

    ngOnInit() {
      this.serviceId = this.serviceTypeService.getServiceId();

        if (this.serviceId) {
            this.http.get<any>(`http://localhost:3000/api/service/${this.serviceId}`).subscribe(
                response => {
                    this.service = response;
                    console.log("ดึงข้อมูลสำเร็จ", response);
                },
                error => {
                    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", error);
                }
            );
        }
        const userId = localStorage.getItem('user_id');
        if (userId) {
            this.bookingData.user_id = userId;
        } else {
            console.error('ไม่พบ user_id ใน localStorage');
        }
      }

    async addBooking() {
      if (!this.serviceId) {
        console.error('กรุณากรอกข้อมูลให้ครบ');
        return;
      }
      const alert = await this.alertController.create({
        header: 'ยืนยันการจอง',
        message: 'คุณต้องการจองบริการนี้หรือไม่?',
        buttons: [
          {
            text: 'ยกเลิก',
            role: 'cancel',
            handler: () => {
              console.log('การจองถูกยกเลิก');
            }
          },
          {
            text: 'ยืนยัน',
            handler: () => {
              this.confirmBooking();
            }
          }
        ]
      });
      await alert.present();
    }
      confirmBooking() {
      this.bookingData.booking_date = moment().format('YYYY-MM-DD');
      this.bookingData.booking_time = moment().format('HH:mm:ss');
      this.bookingData.service_id = this.serviceId!;
      this.http.post<any>('http://localhost:3000/api/bookings', this.bookingData)
        .subscribe(
          (response) => {
            console.log('เพิ่มการจองสำเร็จ', response);
            alert('จองสำเร็จ!  ');
            this.navCtrl.navigateBack('/home');
          },
          (error) => {
            console.error('เกิดข้อผิดพลาดในการจอง', error);
            alert('เกิดข้อผิดพลาดในการจอง');
          }
        );
    }


}
