import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/login';

  constructor(private http: HttpClient) {}

  login(phoneNumber: string){
    const body = { phone: phoneNumber};
    const data = this.http.post<any>('http://localhost:3000/api/login', body)
    return data
  }
  verifyOtp(phone:string,otp:string){
   const body = {phone:phone,otp:otp}
   const data = this.http.put<any>('http://localhost:3000/api/verify-otp',body)
   return data
  }
}
