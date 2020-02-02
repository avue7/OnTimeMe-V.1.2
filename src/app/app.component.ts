import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, LoadingController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { NetworkService } from 'src/services/network.service';


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
  networkConnectedSub: Subscription;
  networkDisconnectSub: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
    private loadingCtrl: LoadingController,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService,
    private network: Network,
    private networkService: NetworkService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('******* START INITALIZE APP *********');
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByName('black');
    })
    .then(() => {
      // If app gets restarted and it already has a user subscription
      // then dont create another one without unsubscibing to the first one.
      if (this.userSubscription) {
        console.log('App restarted, unsubscribing current user sub');
        this.userSubscription.unsubscribe();
      }

      this.createUserAuthObservable().then(userName => {
        this.isLoggedIn(userName);
      });

      this.createNetworkObservables();
    });
  }

  isLoggedIn(userName: any) {
    console.log('----------Initial Boot UP---------------');
    console.log('2. AppComponent::(DEBUG): this.username', this.userName +
    ' userNameParam: ', userName);

    if (userName) {
      this.splashScreen.hide();

      console.log('3. AppComponent::isLoggedIn(): routing to home...');
      this.router.navigate(['/home']);
    } else {
      this.splashScreen.hide();

      console.log('3. AppComponent::isLoggedIn(): routing to login page...');
      this.router.navigate(['/login']);
    }
  }

  createUserAuthObservable() {
    return new Promise(resolve => {
      this.userSubscription = this.authService.getUserProfileObservable().subscribe(
        user => {
          if (user) {
            console.log('1. AppComponent::observer: Setting new user:', user);

            this.userName = user.displayName;
            this.userEmail = user.email;
            this.userPicture = user.photoURL;

            resolve(this.userName);
          } else {
            console.log('1. AppComponent::observer: Setting new user:', user);
            resolve(null);
          }
        }
      );
    });
  }

  // Checks the network for connection. Disables and enables certain
  // functionalities of the apps based on dependency of network.
  createNetworkObservables() {
    console.log('Creating network observables');
    this.networkConnectedSub = this.network.onConnect().subscribe(data => {
      const networkType = this.network.type;
      this.networkService.enableFunctionality();
      this.networkService.onConnectUpdate(data.type, networkType);
      console.log('Connected via ' + networkType);
    });

    this.networkDisconnectSub = this.network.onDisconnect().subscribe(data => {
      this.networkService.disableFunctionality();
      this.networkService.onDisconnectUpdate();
      console.log('Disconnected from internet');
    });
  }

  logout() {
    this.menu.close();
    // Must unsubscribe the user before heading logging out.
    // this.userSubscription.unsubscribe();
    console.log('Checking user subscription', this.userSubscription);
    this.authService.logout();
  }

}
