import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, LoadingController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
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

  userName: any;
  userEmail: any;
  userPicture: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
    private loadingCtrl: LoadingController,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready().then( async () => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByName("black");
      this.isLoggedIn();
    });
  }

  async isLoggedIn(){
    await this.nativeStorage.getItem('google_user')
    .then (async data => {
      console.log("AppComponent:: user already logged in:", data);
      this.userName = data.name;
      this.userEmail = data.email;
      this.userPicture = data.picture;

      await setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);

      this.router.navigate(["/home"]);
    }, async error => {
      console.log("AppComponent:: no user logged in...routing to login page");

      this.userName = null;
      this.userEmail = null;
      this.userPicture = null;

      await setTimeout(() => {
        this.splashScreen.hide();
      }, 2000)

      this.router.navigate(["/login"]);
    });
  }

  logout(){
    this.menu.close();
    this.authService.logout();
  }

}
