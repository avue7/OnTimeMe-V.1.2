import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private nativeStorage: NativeStorage
  ) { }

  async getUserName(){
    await this.nativeStorage.getItem('google_user')
    .then((user) => {
      return user.name;
    });
  }

  async getUserEmail() {
    await this.nativeStorage.getItem('google_user')
    .then((user) => {
      return user.email;
    });
  }

  async getUserPicture() {
    await this.nativeStorage.getItem('google_user')
    .then((user) => {
      return user.picture;
    });
  }
}
