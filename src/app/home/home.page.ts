import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard , IonContent } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ServiceTypeService } from '../service-type.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private serviceTypeService: ServiceTypeService, private router: Router) {}

  categories = [
    { name: 'แนะนำ',  },
    { name: 'กราฟฟิค', id: '1' },
    { name: 'เว็บไซต์', id: '2' },
    { name: 'ไลฟ์สไตล์', id: '3' },
    { name: 'ธุรกิจและที่ปรึกษา', id: '4' },
  ];
  selectedCategory = 'แนะนำ';

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  selectService(id: string) {
    this.serviceTypeService.setServiceType(id);
  this.router.navigate(['/service']);
 }

 goToCategory(category: any) {
  console.log('Category clicked:', category);
  if (category.id) {
    this.serviceTypeService.setServiceType(category.id);
    this.router.navigate(['/service']);
  } else {
    this.router.navigate(['/home']);
  }
}
}

