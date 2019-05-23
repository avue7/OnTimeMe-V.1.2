import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: firebase.User;

  constructor(
    private googlePlus: GooglePlus,
    private loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    afAuth.authState.subscribe(user => {
      this.user = user;
      console.log("LoginPage:: user is:", this.user);
    });
  }

  async doGoogleLogin(loading){
    this.googlePlus.login({
      'scopes' : 'https://www.googleapis.com/auth/calendar.readonly',
      'webClientId' : '955792506678-kmjd5q1kqpjsv603fcob8rr29fss6fff.apps.googleusercontent.com',
      'offline' : true
    })
    .then(user => {
      loading.dismiss();
      console.log("LoginPage:: user is:", user);

      this.nativeStorage.setItem('google_user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      })

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

  async logout(){
    await this.afAuth.auth.signOut().then( async () => {
      console.log("Successfully logged out");
      await this.trySilentLogin().then(() => {

      })
      .then ( async () => {
        await this.googlePlus.logout().then(response => {
          console.log("Successfully logged out of google", response);
        })
        .then ( async () => {
          await this.nativeStorage.remove("google_user");
        })
        .then ( async () => {
          await this.nativeStorage.getItem('google_user')
          .then(data => {
            console.log("This should be null", data);
          }, error => {
            console.log("Correct if this is an error", error);
          });
        })
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
