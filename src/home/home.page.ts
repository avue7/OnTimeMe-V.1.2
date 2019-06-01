import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleCalendarService } from '../services/google-calendar.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


//Testing
import { ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private statusBar: StatusBar,
    private googleCalendar: GoogleCalendarService,
    private nativeStorage: NativeStorage,
    private authService: AuthService
  ) {
    this.getAccessToGoogleCalendar();
  }

  getAccessToGoogleCalendar(){
    let serverAuthCode : any;

    console.log("checking storage for user data");
    // Get serverAuthCode from native storage
    this.nativeStorage.getItem('google_user').then((user) => {
      console.log("User data is", user);
      serverAuthCode = user.serverAuthCode;

      // Now initialize service routine for getting temp
      // accessToken and get calendar list
      this.googleCalendar.init(serverAuthCode).then(authToken => {
        console.log("HomePage:: authToken returned is", authToken)

        let allEventFlag = false;
        this.googleCalendar.getList(authToken).then(list => {
          console.log("Testing calendar list is", list)
        }, error => {
          console.log("Error getting list", error);
        });
      }, error => {
        console.log("Home:: googleCalendar init() error", error);
      })
    });
  }



}
