import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private nativeStorage: NativeStorage,
    private auth: AuthService
  ) { }





}
