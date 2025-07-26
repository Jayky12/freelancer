import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  private serviceTypeId: string | null = null;
  private serviceId: string | null = null;

  setServiceType(id: string) {
    this.serviceTypeId = id;
  }

  getServiceType() {
    return this.serviceTypeId;
  }
  setServiceId(id: string) {
    this.serviceId = id;
}

getServiceId() {
    return this.serviceId;
}
}
