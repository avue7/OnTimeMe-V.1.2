import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
// import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  private user: firebase.User;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    //this.doGoogleLogin();
  }

  async doGoogleLogin(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.authService.doGoogleLogin(loading);
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
