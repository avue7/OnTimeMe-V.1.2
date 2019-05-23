import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
    private googlePlus: GooglePlus,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
      this.isLoggedIn();
    });
  }

  isLoggedIn(){
    this.nativeStorage.getItem('google_user')
    .then (data => {
      this.router.navigate(["/home"]);
      this.splashScreen.hide();
    }, error => {
      this.router.navigate(["/login"]);
      this.splashScreen.hide();
    });
    this.statusBar.styleDefault();
  }


}
