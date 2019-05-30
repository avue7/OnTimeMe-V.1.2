import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { UserService } from './user.service';

import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: firebase.User;

  afAuthSubscription: any;
  private subject = new Subject<any>();

  constructor(
    private googlePlus: GooglePlus,
    private loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage,
    private router: Router,
    public afAuth: AngularFireAuth,
    private userService: UserService
  ) {
    afAuth.authState.subscribe(user => {
      console.log("DEBUGGING:: AuthService: user changed", user);
      this.user = user;
      this.sendUserData(user);
    });
  }

  sendUserData(user : any){
    this.subject.next(user);
  }

  getUserData(){
    return this.subject.asObservable();
  }

  async doGoogleLogin(loading){
    this.googlePlus.login({
      'scopes' : 'https://www.googleapis.com/auth/calendar.readonly',
      'webClientId' : '955792506678-kmjd5q1kqpjsv603fcob8rr29fss6fff.apps.googleusercontent.com',
      'offline' : true
    })
    .then(user => {
      loading.dismiss();

      // this.userService.setUserData(user);

      let googleCredential = firebase.auth.GoogleAuthProvider.credential(user.idToken);
      this.afAuth.auth.signInAndRetrieveDataWithCredential(googleCredential).then(response => {
        console.log("Successfully signed in with google plus", response);
        this.router.navigate(["/home"]);
      }, error => {
        console.log("Error validating credentials", error);
      })

      loading.dismiss();
    }, err => {
      console.log("Google login error:", err);
      loading.dismiss();
    });
  }

  logout(){
    this.afAuth.auth.signOut().then( async () => {
      console.log("Successfully logged out of afAuth");
      this.trySilentLogin().then(() => {})
      .then (() => {
        this.googlePlus.logout().then(response => {
          console.log("Successfully logged out of google", response);
        })
        .then (() => {
          this.afAuthSubscription.unsubscribe();
          this.userService.deleteUserData();
        });
      })
      .then ( () => {
        this.router.navigate(['/login']);
      });
    }, error => {
      console.log("Error logging out", error);
    });
  }

  trySilentLogin(){
    return this.googlePlus.trySilentLogin({
      'scopes' : 'https://www.googleapis.com/auth/calendar.readonly',
      'webClientId' : '955792506678-kmjd5q1kqpjsv603fcob8rr29fss6fff.apps.googleusercontent.com',
      'offline' : true
    })
    .then ((succ) => {
      console.log("AuthService:: trySilentLogin(): successful");
    }, error => {
      console.log("AuthService:: trySilentLogin(): failed,", error);
    });
  }

}
