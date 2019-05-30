import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // userDataSubscription: any;
  userData: any;

  constructor(
    private nativeStorage: NativeStorage
  ) { }

  setUserData(userParam: any){
    console.log("UserService::setUserData(): userParam", userParam);

    let userData = {
      name: userParam.displayName,
      email: userParam.email
    };

    if(userParam.photoURL){
      userData["picture"] = userParam.photoURL;
    } else if (userParam.imageURL){
      userData["picture"] = userParam.imageURL;
    } else {
      userData["picture"] = null;
    }

    console.log("=====>> Storing in native next, userData:", userData);

    this.nativeStorage.setItem('google_user', userData)
    .then( (data) => {

      this.userData = data;

      let name, email, picture : any;
      name = this.getUserName();
      console.log("1. DEBUGG:: done setting user data");
      console.log("2. User data is: name: " + name )
      console.log("3. this user data is:", this.userData);
    });
  }

  getUserName(){
    // return new Promise(resolve => {
    // let userName: any;
      this.nativeStorage.getItem('google_user')
      .then((user) => {
        console.log("Native username", user.name)
        // resolve(user.name);
        return user.name;
      }, error => {
        console.log("UserService:: getUserName(): native storage returned null")
        return null;
      });
    // });
  }

  async getUserEmail() {
    await this.nativeStorage.getItem('google_user')
    .then((user) => {
      return user.email;
    }, error => {
      console.log("UserService:: getUserEmail(): native storage returned null")
    });
  }

  async getUserPicture() {
    await this.nativeStorage.getItem('google_user')
    .then((user) => {
      return user.picture;
    }, error => {
      console.log("UserService:: getUserPicture(): native storage returned null")
    });
  }

  async deleteUserData() {
    await this.nativeStorage.remove('google_user');
  }

  async getUserProfile(){
    await this.nativeStorage.getItem('google_user')
    .then((userData) => {
      return userData;
    }, error => {
      console.log("UserService:: getUserProfile(): native storage returned null")
    });
  }

  getUserData(){
    return this.userData;
  }

  createUserObservable(){
    // if(this.userDataSubscription){
    //   this.deleteUserDataSubscription();
    // };

    let observable = new Observable(observer => {
      observer.next(this.getUserData());
    });

    console.log("0: UserService:: observable created");
    return observable;
  }

  // async deleteUserDataSubscription(){
  //   await this.userDataSubscription.unsubscribe();
  // }
}
