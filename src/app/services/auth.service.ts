import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/loginModel';
import { PasswordChangeModel } from '../models/passwordChangeModel';
import { RegisterModel } from '../models/register';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { LocalStorageService } from './local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // apiUrl="https://localhost:44388/api/auth/";
  apiUrl = "http://localhost:5000/api/auth/";
  name: string = "";
  surname: string = "";
  userName: string = "";
  role: any;
  roles: any[] = [];
  token: any;
  isLoggedIn: boolean = false;
  userId: number;
  email: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private localStorage: LocalStorageService

  ) { }

  login(loginModel: LoginModel): Observable<TokenModel> {
    return this.httpClient.post<TokenModel>(this.apiUrl + "login", loginModel)
  }

  register(registerModel: RegisterModel): Observable<TokenModel> {
    return this.httpClient.post<TokenModel>(this.apiUrl + "createuser", registerModel)
  }

  logout() {

    this.localStorage.clear()
    this.onRefresh();
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    if (this.localStorage.getItem("token")) {
      return true;
    }
    else {
      return false
    }
  }

  getUserDetails(): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl + "getuser")
  }

  userDetailFromToken() {
    this.token = this.localStorage.getItem("token");
    this.getUserDetails().subscribe((res) => {
      this.name = res.name;
    })
    // let decodedToken = this.jwtHelper.decodeToken(this.token);
    // let name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    // console.log(name)
    // this.name = name.split(' ')[0];
    // let surname = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    // this.surname = surname.split(' ')[1];
    // this.roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    // this.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    // this.userId = parseInt(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
    // this.email = decodedToken["email"];
    // this.userName = name.split(' ')[0] + " " + surname.split(' ')[1];

  }

  roleCheck(roleList: string[]) {
    if (this.roles !== null) {
      roleList.forEach(role => {
        if (this.roles.includes(role)) {
          return true;
        } else {
          return false;
        }
      })
      return true;
    } else {
      return false;
    }
  }
  async onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false }
    const currentUrl = this.router.url + '?'
    console.log(currentUrl)
    return this.router.navigateByUrl(currentUrl).then(() => {
      console.log(currentUrl)
      this.router.navigated = false
      this.router.navigate(['/home'])
    })
  }


  changePassword(passwordChangeModel: PasswordChangeModel): Observable<ResponseModel> {
    let newPath = this.apiUrl + "changepassword"
    return this.httpClient
      .post<ResponseModel>(newPath, passwordChangeModel)
  }

  getCurrentUserId(): number {
    return this.userId
  }

}
