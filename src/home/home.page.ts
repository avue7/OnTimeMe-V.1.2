import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleCalendarService } from '../services/google-calendar.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


//Testing
import { ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CalendarEventsService } from 'src/services/calendar-events.service';
import { DatabaseService } from 'src/services/database.service';
import { NativeCalendarService } from 'src/services/native-calendar.service';
import { TransModeService } from 'src/services/trans-mode.service';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  eventList: any;
  allEventMode: any;
  // routerSub: Subscription;
  userSubscription: Subscription;

  constructor(
    private statusBar: StatusBar,
    private googleCalendar: GoogleCalendarService,
    private nativeStorage: NativeStorage,
    private authService: AuthService,
    private events: CalendarEventsService,
    private database: DatabaseService,
    private nativeCalendar: NativeCalendarService,
    private transMode: TransModeService,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  // Methods in this lifecycle will run everytime page is in the view
  ionViewDidEnter(){
    console.log("============= Homapage LOADED ================")
    this.checkMode().then((mode) => {
      this.allEventMode = mode;
      console.log("checkmode returned mode", this.allEventMode);
      this.runCalendarRoutine();
    }, error => {
      console.log("Error while checking mode")
    });
  }

  ionViewDidLeave(){
  }

  checkMode(){
    return new Promise(resolve => {
      this.transMode.getAllEventMode().then(mode => {
        if(mode){
          console.log("Home::checkMode(): all event mode is", mode);
          resolve(mode)
        } else {
          console.log("Home::checkMode(): all event mode not set yet!");
          let titleParam = "Welcome to OnTimeMe";
          let message = "Please select default transportation mode for all events"
          this.transMode.setAllEventMode(undefined, titleParam, message).then(() => {
            this.transMode.getAllEventMode().then(mode => {
              // this.allEventMode = mode;
              resolve(mode);
            });
          });
        };
      });
    })
  }

  changeAllEventMode(){
    let title = "Change transportation mode for all events?";
    let message = "This will subtract -1 refresh token";
    this.transMode.changeAllEventMode(this.allEventMode, title, message).then(() => {
      this.transMode.getAllEventMode().then(mode => {
        this.allEventMode = mode;
      });
    });
  }

  // This method serves as the main method to invoke other methods
  // that will eventually get calendar events and update the home
  // page view appropriately. This is a helper method created to
  // help the background fetch.
  runCalendarRoutine(){
    this.getAccessToGoogleCalendar();
  }

  getTodaysEvents(){
    this.nativeCalendar.getTodaysEventsEvent();
  }

  // Get access to google calendar and get the list for the
  // next 24 hours
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
        // this.googleCalendar.watchEventList(authToken);

        this.getList(authToken).then(list => {
          console.log("Testing calendar list is", list)

          // Once we have the list then invoke the store method in
          // calendar events service to store list.
          // this.events.storeTodaysEvents(JSON.stringify(list), undefined, undefined, allEventFlag).then(() => {
          //
          // });

        }, error => {
          console.log("Error getting list", error);
        });
      }, error => {
        console.log("Home:: googleCalendar init() error", error);
      })
    });
  }

  getList(authToken: any, allEventFlag?: any){
    return new Promise (resolve => {
      this.googleCalendar.getList(authToken).then( (list) => {
        this.eventList = list;

        // resolve(list);

        // this.events.storeTodaysEvents(JSON.stringify(this.eventList),undefined,undefined, allEventFlag).then(() => {
          // console.log('Home::getList(): successfully saved todays events:', this.events);
    //       this.event.getTodaysEvents().then((events) =>{
    //         if (events === 0){
    //           console.log("Home::getList(): user has no events");
    //           resolve(0);
    //         } else {
    //           this.eventList = events;
    //           this.epochNow = this.realTimeClock.getEpochTime();
    //           this.epochNow = this.epochNow.share();
    //           // SUCCESSFULLY GOT LIST, This is the time when you need to store to last known
    //           let date = new Date();
    //           this.user.getUserInfo().then((user) => {
    //             this.storage.getItem(user.id).then((curUser) => {
    //               this.storage.setItem('lastKnown', {mode: curUser.mode, time: date}).then(() => {
    //                 this.storage.getItem('lastKnown').then((last) => {
    //                   this.storage.getItem('lastKnownLocation').then((loc) => {
    //                     this.lastMode = last.mode;
    //                     this.lastUpdateTime = last.time;
    //                     this.lastLocation = loc.origin;
    //                     resolve(this.eventList.length);
    //                   }, (error5) => { console.log("Home::getList():,", error5) });
    //                 }, (error4) => { console.log("Home::getList():", error4) });
    //               }, (error3) => { console.log("Home::getList():", error3) });
    //             }, (error2) => { console.log("Home::getList():", error2) });
    //           }, (error1) => { console.log("Home::getList():", error1) });
    //         };
    //         /////////////////////////////////////////////////////////////////////////////
    //         console.log('Home::getList(): successfully got user events ', events);
    //       }, (err) => { console.log('Home::getList(): failed to get saved events', err) });
    //     }, (err) => { console.log('Home::getList(): failed to save events ', err) });
    //   }, (error) => { console.log("Home::getList(): error:", error) });
        });
      });
    // });
  }

  ngOnDistroy(){
    // this.routerSub.unsubscribe();
    this.allEventMode = null;
  }


}
