import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';


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
    private authService: AuthService,
    private statusBar: StatusBar
  ) {
    // this.statusBar.overlaysWebView(true);
    // this.statusBar.styleDefault();
  }

  ngOnInit() {
    //this.doGoogleLogin();
  }

  async doGoogleLogin(){
    const loading = await this.createLoading();
    await this.presentLoading(loading);

    console.log("3")
    this.authService.doGoogleLogin(loading);
  }

  async createLoading(){
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'bubbles',
      // animated: true,
      cssClass: 'custom-loader-class',
      showBackdrop: true,
      backdropDismiss: true
    });
    console.log("1")
    return loading;
  }

  async presentLoading(loading) {
    console.log("2")
    await loading.present();
  }

}
