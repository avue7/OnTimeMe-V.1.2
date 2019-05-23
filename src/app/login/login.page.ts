import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
// import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  private user: firebase.User;

  constructor(
    private googlePlus: GooglePlus,
    private loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    // this.user = this.afAuth.authState;
    afAuth.authState.subscribe(user => {
      this.user = user;
      console.log("LoginPage:: user is:", this.user);
    });
  }

  ngOnInit() {
    this.doGoogleLogin();
  }

  async doGoogleLogin(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

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

  async presentLoading(loading) {
    return await loading.present();
  }

}
