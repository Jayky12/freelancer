import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceTypeService } from '../service-type.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
  standalone: false,
})
export class ServicePage implements OnInit {
  serviceTypeId: string | null = null;
  service: any= [];

  constructor(private serviceTypeService: ServiceTypeService,private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.serviceTypeId = this.serviceTypeService.getServiceType();

    if (this.serviceTypeId) {
      this.http.get<any[]>(`http://localhost:3000/api/service?type=${this.serviceTypeId}`).subscribe(response => {
        this.service = response;
        console.log("ดึงข้อมูลสำเร็จ", response);
      }, error => {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", error);
      });
    }

}
goToBooking(serviceId: string) {
  this.serviceTypeService.setServiceId(serviceId);
  this.router.navigate(['/booking']);
}

}
