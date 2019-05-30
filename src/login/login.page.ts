import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage {

  private user: firebase.User;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private authService: AuthService,
    private statusBar: StatusBar
  ) {
  }

  async doGoogleLogin(){
    const loading = await this.createLoading();
    await this.presentLoading(loading);
    this.authService.doGoogleLogin(loading);
  }

  async createLoading(){
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'bubbles',
      cssClass: 'custom-loader-class',
      showBackdrop: true,
      backdropDismiss: true
    });
    return loading;
  }

  async presentLoading(loading) {
    await loading.present();
  }
}
