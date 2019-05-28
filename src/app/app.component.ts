import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, LoadingController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from './services/auth.service';


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
    // private googlePlus: GooglePlus,
    private loadingCtrl: LoadingController,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      // this.statusBar.styleDefault();
      // this.statusBar.styleBlackOpaque();
      this.statusBar.backgroundColorByName("black");
      // this.statusBar.backgroundColorByHexString("#183382");
      // this.statusBar.styleBlackTranslucent();



      // this.splashScreen.hide();
      this.isLoggedIn();
    });
  }

  async isLoggedIn(){
    await this.nativeStorage.getItem('google_user')
    .then (data => {
      console.log("AppComponent:: user already logged in:", data);
      this.router.navigate(["/home"]);
      this.splashScreen.hide();
    }, error => {
      console.log("AppComponent:: no user logged in...routing to login page");
      // this.statusBar.styleDefault();

      this.router.navigate(["/login"]);

      this.splashScreen.hide();
    });
    // this.statusBar.styleDefault();
  }

  logout(){
    this.menu.close();
    this.authService.logout();
  }

}
