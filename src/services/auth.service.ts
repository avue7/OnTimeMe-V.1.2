import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: firebase.User;
  private afAuthSubscription: any;
  private subject = new Subject<any>();

  constructor(
    private googlePlus: GooglePlus,
    private loading: LoadingController,
    private nativeStorage: NativeStorage,
    private router: Router,
    public afAuth: AngularFireAuth,
  ) {
    afAuth.authState.subscribe(user => {
      console.log('DEBUGGING:: AuthService: user changed', user);
      this.user = user;
      this.sendUserData(user);
    });
  }

  sendUserData(user: any){
    this.subject.next(user);
  }

  getUserProfileObservable(){
    return this.subject.asObservable();
  }

  async doGoogleLogin(loading: HTMLIonLoadingElement) {
    this.googlePlus.login({
      webClientId : '955792506678-h09nnar8geirvpsev6i9bm9a2hs2mn3b.apps.googleusercontent.com',
      scopes : 'https://www.googleapis.com/auth/calendar',
      offline : true
    })
    .then(user => {
      const userData = {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl,
        authToken: user.accessToken,
        serverAuthCode: user.serverAuthCode,
        idToken: user.idToken
      };

      const googleCredential = firebase.auth.GoogleAuthProvider.credential(user.idToken);

      this.afAuth.auth.signInAndRetrieveDataWithCredential(googleCredential).then(async response => {
        console.log('Successfully signed in with google plus', response);

        // userData['userId'] = response.user.uid;

        await this.storeUserData(userData);

        this.router.navigate(['/home']);
      }, error => {
        console.log('Error validating credentials', error);
      });

      loading.dismiss();
    }, err => {
      console.log('Google login error:', err);
      loading.dismiss();
    });
  }

  storeUserData(userParam: any){
    this.nativeStorage.setItem('google_user', userParam);
  }

  getUserData(){
    return this.nativeStorage.getItem('google_user');
  }

  getUserId(){
    const user = firebase.auth().currentUser;
    return user.uid;
  }

  clearNativeStorage(){
    this.nativeStorage.clear().then(() => {
      console.log('Clearing everything in native storage before logging out');
    });
  }

  logout() {
    this.googlePlus.trySilentLogin ({
      webClientId : '955792506678-h09nnar8geirvpsev6i9bm9a2hs2mn3b.apps.googleusercontent.com',
      scopes : 'https://www.googleapis.com/auth/calendar',
      offline : true
    }).then(() => {
      this.googlePlus.disconnect().then (() => {
        this.afAuth.auth.signOut().then( async () => {
          console.log('Successfully logged out of afAuth');
          this.clearNativeStorage();
          this.router.navigate(['/login']);
        }, error => {
          console.log('Error logging out', error);
        });
      });
    });
  }


}
