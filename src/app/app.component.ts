import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, LoadingController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';

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

  userSubscription: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
    private loadingCtrl: LoadingController,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService,
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByName("black");
    })
    .then(() => {
      this.createUserAuthObservable().then(userName => {
        this.isLoggedIn(userName);
      })
    });
  }

  isLoggedIn(userName : any){
    console.log("----------Initial Boot UP---------------")
    console.log("2. AppComponent::(DEBUG): this.username", this.userName +
    " userNameParam: ", userName);

    if(userName){
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);

      console.log("3. AppComponent::isLoggedIn(): routing to home...");
      this.router.navigate(["/home"]);
    } else {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);

      console.log("3. AppComponent::isLoggedIn(): routing to login page...");
      this.router.navigate(["/login"]);
    }
  }

  createUserAuthObservable(){
    return new Promise(resolve => {
      this.userSubscription = this.authService.getUserData().subscribe(
        user => {
          if(user){
            console.log("1. AppComponent::observer: Setting new user:", user);

            this.userName = user.displayName;
            this.userEmail = user.email;
            this.userPicture = user.photoURL;

            resolve(this.userName);
          } else {
            console.log("1. AppComponent::observer: Setting new user:", user);
            resolve(null)
          }
        }
      )
    });
  }

  logout(){
    this.menu.close();
    // Must unsubscribe the user before heading logging out.
    this.userSubscription.unsubscribe();
    console.log("Checking user subscription", this.userSubscription);
    this.authService.logout();
  }

}
