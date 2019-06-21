import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class GoogleCalendarService {
  data: any;
  events: any;
  calendarUrl: any = 'https://www.googleapis.com/calendar/v3';
  eventList: any = '/calendars/primary/events';
  watchList: any = '/calendars/primary/events/watch';


  // Testing refresh token
  code: any;
  authUrl: any = 'https://www.googleapis.com/oauth2/v4/token';
  secret: any = 'M_EZMo6UHWEbAdmtuPDvfs-I';
  redirectUri: any = 'http://localhost:8080';
  clientId: any = '955792506678-h09nnar8geirvpsev6i9bm9a2hs2mn3b.apps.googleusercontent.com';

  constructor(
    public http: HttpClient,
    private storage: NativeStorage
  ) { }

  // STEP 1:
  // See if refreshToken exists
  init(serverAuthCode?: any) : Promise<any>{
    return new Promise(resolve => {
      this.storage.getItem('refreshToken').then((RT) => {
        console.log("Google-calendar::init(): refreshToken already stored:,", RT.token);
        // If it does skip the auth step to get RT, and go get accessToken
        // using RT
        resolve(this.getTempAuthToken(RT.token));
      }, (error) => {
        console.log("Google-calendar::init(): refreshToken not set:", error);
        // Else, we need to get RT using the authCode from initial scope
        resolve(this.getRefreshTokenId(serverAuthCode));
      });
    });
  }

  // STEP 2:
  // Go to this step if no RT is found. This step gives you a RT and an accessToken.
  // We ignore the accessToken, and use the RT to get a new refreshed accessToken.
  getRefreshTokenId(serverAuthCode: any){
    return new Promise(resolve => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      };

      const params = {
        'code': serverAuthCode,
        'client_id': this.clientId,
        'client_secret': this.secret,
        'redirect_uri': this.redirectUri,
        'grant_type': 'authorization_code'
      }
      this.http.post(this.authUrl, httpOptions, { params }).subscribe((data) => {
        //console.log("Google-calendar::getRefreshTokenId(): succesfully got RT_id", data);
        let refreshToken = data['refresh_token'];
        this.storage.setItem('refreshToken', { token: refreshToken });
        resolve(this.getTempAuthToken(data['refresh_token']));
      }, (error) => {
        console.log("Google-calendar::getRefreshTokenId(): failed!", error);
      });
    });
  }

  // STEP 3:
  // Get the refresh authToken that we will need for calendar api calls
  getTempAuthToken(refreshTokenId: any){
    return new Promise(resolve => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      };

      const params = {
        'refresh_token': refreshTokenId,
        'client_id': this.clientId,
        'client_secret': this.secret,
        'grant_type': 'refresh_token'
      }
      this.http.post(this.authUrl, httpOptions, { params }).subscribe((data) => {
        let accessToken = data['access_token'];
        //console.log("Google-calendar::getTempAuthToken(): successfully got accessToken", accessToken);
        resolve(accessToken);
      }, (error) => {
        console.log("Google-calendar::getTempAuthToken(): failed!", error);
      });
    });
  }

  watchEventList(authToken: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + authToken
      })
    };

    let bodyRequest = {
      id: '123@1212321321321321321321321321',
      type: 'web_hook',
      address: 'https://ontimeme-c948f.firebaseapp.com/testing.json'
    }

    let today = new Date(Date.now()).toISOString();
    let tomorrow = new Date(Date.now() + 86400000).toISOString();
    // let urlParams = '?timeMax='+ tomorrow + '&timeMin=' + today + '&orderBy=startTime&singleEvents=true';

    return new Promise(resolve => {
      this.http.post(this.calendarUrl + this.watchList /*+ urlParams*/, bodyRequest, httpOptions).subscribe(data => {
        console.log("Google calendar changed", data);
        resolve(data);
      // }, (error) => {
      //   console.log("Google-calendar::getList(): cannot get list, token expired:", error);
      //   console.log("===>>>> using refresh token to get new authToken");
      //   // this.init().then((newAuthToken) => {
      //     // resolve(this.getList(newAuthToken));
      //   // });
      //
      //   this.storage.getItem('google_user').then(user => {
      //     let refreshToken = user.refreshToken;
      //     this.getTempAuthToken(refreshToken).then((newAuthToken) => {
      //       // resolve(this.getList(newAuthToken));
      //       console.log("========>>>>", newAuthToken)
      //       resolve();
      //     })
      //   })
      });
    });
  }


  // STEP 4:
  //  Use the authToken from above method to make the api call
  getList(authToken: string) : Promise<any>{
    //  This was taken from the angular 2 documenation on how to set HttpHeaders
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + authToken
      })
    };

    // Gets RFC3339 formatted date strings to pass to calendar api to limit results to today.
    let today = new Date(Date.now()).toISOString();
    let tomorrow = new Date(Date.now() + 86400000).toISOString();
    let urlParams = '?timeMax='+ tomorrow + '&timeMin=' + today + '&orderBy=startTime&singleEvents=true';

    if (this.events) {
      return Promise.resolve(this.data);
    };

    // Don't have data yet
    return new Promise(resolve => {
      this.http.get(this.calendarUrl + this.eventList + urlParams, httpOptions).subscribe(data => {
        resolve(data);
      // }, (error) => {
      //   console.log("Google-calendar::getList(): cannot get list, token expired:", error);
      //   console.log("===>>>> using refresh token to get new authToken");
      //   // this.init().then((newAuthToken) => {
      //     // resolve(this.getList(newAuthToken));
      //   // });
      //
      //   this.storage.getItem('google_user').then(user => {
      //     let refreshToken = user.refreshToken;
      //     this.getTempAuthToken(refreshToken).then((newAuthToken) => {
      //       // resolve(this.getList(newAuthToken));
      //       console.log("========>>>>", newAuthToken)
      //       resolve();
      //     })
      //   })
      });
    });
  }
}
