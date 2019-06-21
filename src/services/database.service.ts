import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './auth.service';


import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private nativeStorage: NativeStorage,
    private auth: AuthService,
    public afAuth: AngularFireAuth
  ) { }

  getCurrentUserRef(){
    let db = firebase.firestore();
    // db.settings({
    //   timestampsInSnapshots: true
    // });
    let currentUser = firebase.auth().currentUser;
    console.log("Currentuser is", currentUser)

    // this.auth.getUserId().then(userId => {
    //   let id : string;
    //   id = userId;
    // this.nativeStorage.getItem('google_user').then(user => {
    //   let userId = user.userId;
    //   console.log("DEBUGG::: userid is", userId, typeof(userId));
      let currentUserRef = db.collection('users').doc(currentUser.uid);
      return currentUserRef;
    // })

  }

}
