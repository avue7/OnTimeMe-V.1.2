import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventsService {
  mode: any;
  now: any;
  modEventList: any;
  eventListWithTrip: any;

  constructor(
    private storage: NativeStorage,
    private authService: AuthService,
    private db : DatabaseService
    // private map: Map,
    // private locationTracker: LocationTracker,
  /*private googleCalendar: GoogleCalendar*/) {
  }

  // Stores todays events in a new object in storage with the naming convention of
  // user.id + events for example 111696224874024244260events
  // expects a josn object of the Events.list api call
  storeTodaysEvents(jsonString?:any, modeParam?:any, eventParam?:any, allEventFlag?:any) {
    return new Promise<boolean> (resolve =>{
      // set some local variables
      let todaysEventList = [];
      let event_key = "";
      let data = JSON.parse(jsonString);
      let events = data['items'];
      let userId = this.authService.getUserId();
      // this.authService.getUserData().then((user) => {
      event_key = userId + 'events';
      //   // this.map.getPreferenceMode().then((mode) => {
      //     this.mode = mode;
      //     this.storage.getItem(event_key).then((oldEventList) => {
      //       // Create a map to hold old events and modes
      //
      //       // DEBUG: debugger
      //       console.log("Events::storeTodaysEvents(): oldEvents are:", oldEventList);
      //       console.log("ALLEVENT FLAG IS SET", allEventFlag);

            // if (eventParam != undefined){
            //   console.log("Events::storeTodaysEvents(): eventParam.id are:", eventParam.id);
            // };

    //         let oldTransDict = {};
    //         let oldEvents = oldEventList['eventList'];
    //         if (!allEventFlag){
    //           for (let oldEvent of oldEvents) {
    //             if (oldEvent.mode != undefined){
    //               oldTransDict[oldEvent.id] = oldEvent.mode;
    //               if (eventParam != undefined && modeParam != undefined){
    //                 if (oldEvent.id === eventParam.id){
    //                   oldTransDict[oldEvent.id] = modeParam;
    //                   // console.log("OLDEVENT new MODE", modeParam);
    //                 };
    //               };
    //             };
    //
    //             // DEBUG: debugger
    //             console.log("Events::storeTodaysEvents(): for event: <", oldEvent.summary, ">, oldEvent.mode is: <", oldEvent.mode, ">");
    //           };
    //         };
    //         for (let event of events) {
    //           let newMode = this.mode;
    //
    //           //  Check if new event is an old event if so use the old trans mode
    //           if (!allEventFlag){
    //             if (event.id in oldTransDict) {
    //               // console.log("EVEN EXIST IN OLD", oldTransDict[event.id]);
    //               if (oldTransDict[event.id] != null) {
    //                 newMode = oldTransDict[event.id];
    //                 // console.log("NEWMODE : ", newMode);
    //               };
    //             };
    //           };
    //
    //           let start = event['start'];
    //           let end = event['end'];
    //           let beginTime = Date.parse(start['dateTime']) / 1000;
    //           let finishTime = Date.parse(end['dateTime']) / 1000;
    //           let new_event = {
    //             id: event['id'],
    //             summary: event['summary'],
    //             location: event['location'],
    //             startTime: beginTime,
    //             endTime: finishTime,
    //             mode: newMode
    //           };
    //           todaysEventList.push(new_event);
    //         }
    //         let event_list_object = {
    //           eventList: todaysEventList
    //         };
    //         this.user.getUserInfo().then((user) => {
    //           this.storage.setItem(event_key, event_list_object).then(() => {
    //             console.log('Events::storeTodaysEvents(): events saved to user!!', event_list_object);
    //             resolve(true);
    //           }, (err) => {
    //             console.log('Events::storeTodaysEvents failed to store events ', err);
    //           });
    //         }, (err) => {
    //           console.log('Events::storeTodaysEvents failed to get user ', err);
    //         });
    //       }, (err) => {
    //         console.log("events::storeTodaysEvents and old event list was not found");
    //         //resolve(this.setAllEventMode());
    //         for (let event of events) {
    //           let start = event['start'];
    //           let end = event['end'];
    //           let beginTime = Date.parse(start['dateTime']) / 1000;
    //           let finishTime = Date.parse(end['dateTime']) / 1000;
    //           let new_event = {
    //             id: event['id'],
    //             summary: event['summary'],
    //             location: event['location'],
    //             startTime: beginTime,
    //             endTime: finishTime,
    //             mode: this.mode
    //           };
    //           todaysEventList.push(new_event);
    //         }
    //         let event_list_object = {
    //           eventList: todaysEventList
    //         };
    //         this..getUserInfo().then((user) => {
    //           this.storage.setItem(event_key, event_list_object).then(() => {
    //             console.log('Events::storeTodaysEvents(): events saved to user!!');
    //             resolve(true);
    //           }, (err) => {
    //             console.log('Events::storeTodaysEvents(): failed to store events ', err);
    //           });
    //         }, (err) => {
    //           console.log('Events::storeTodaysEvents(): failed to get user ', err);
    //         });
    //       });
    //     }, (err)=>{console.log("Events::storeTodaysEvents(): did not get a preference mode", err)});
    //   }, (err) => {console.log("Events::storeTodaysEvents(): did not get a user object", err);});
    });
  }
  //
  // /**
  //  *  Returns an array of events, each event will have all of these
  //  *
  //  *  id: Unique google eventId
  //  *  summary: User defined summary of event
  //  *  location: String address of event
  //  *  startTime: EPOCH start time in seconds
  //  *  entTime:  EPOCH end time in seconds
  //  *  happening: bit value indication event is ongoing or not
  //  *  trip_duration:  miliseconds till event in seconds
  //  *
  //  * @return 0 Promise resolves to 0, if there are no events in the next 24 hrs.
  //  * @return eventsWithTrip The events with trip calculation added; the final events list.
  //  *
  //  */
  // getTodaysEvents() {
  //   return new Promise (resolve => {
  //     this.now = Date.now() / 1000;
  //     this.modEventList = [];
  //     this.eventListWithTrip = [];
  //     this.user.getUserInfo().then((user) => {
  //       this.storage.getItem(user.id + 'events').then((eventList) => {
  //         if (eventList.eventList.length === 0){
  //           resolve(0);
  //         } else {
  //           let events = eventList['eventList'];
  //           this.map.getPreferenceMode().then((mode) => {
  //             this.mode = mode;
  //             let counter = 0;
  //             // console.log("event list length is:", eventList.eventList.length);
  //             for (let event of events) {
  //              counter = counter + 1;
  //              let ongoing = 0;
  //              // Skipping any event that does not have a location.
  //              if(typeof event['location'] === 'undefined') {
  //                 continue;
  //               }
  //               if (this.now >= event['startTime']) {
  //                 ongoing = 1;
  //               }
  //               let new_event = {
  //                 id: event['id'],
  //                 summary: event['summary'],
  //                 location: event['location'],
  //                 startTime: event['startTime'],
  //                 endTime: event['endTime'],
  //                 mode: event['mode'],
  //                 happening: ongoing
  //               };
  //               this.modEventList.push(new_event);
  //               if (counter === events.length){
  //                 this.addTripToList(this.modEventList, mode).then((eventsWithTrip) => {
  //                   resolve(eventsWithTrip);
  //                 });
  //               };
  //             }; // Else statement block ends here...
  //           },(err) =>{
  //             console.log('Events::getTodaysEvents: failed to get prefrence mode', err);
  //           });
  //         };
  //       }, (err) => {
  //         console.log('Events::getTodaysEvents(): failed to get users events object ', err);
  //       });
  //     }, (err) => {
  //       console.log('Events::getTodaysEvents(): failed to fetch events ', err);
  //     });
  //   });
  // }
  //
  // addTripToList(modEventList: any, mode: any){
  //   return new Promise(resolve => {
  //     console.log("modified event list is ", this.modEventList);
  //     let counter = 0;
  //     let tempIndex = -1;
  //     for (let eventd of modEventList) {
  //       counter = counter + 1;
  //       tempIndex = tempIndex + 1;
  //       let origin = this.locationTracker.lat + ',' + this.locationTracker.lng;
  //       // Store origin used for proximity calculation
  //       this.map.getDistance(eventd['location'], eventd['mode'], origin).then ((suc) => {
  //         // Recreate event list with trip duration
  //         console.log("Inside after get distance 226", suc);
  //
  //         let rows = suc['rows'];
  //         let row = rows[0];
  //         console.log("Debugging 230", row['elements'] )
  //         let elements = row['elements'];
  //         console.log("Debugging 230", elements )
  //         let element = elements[0];
  //         let duration = element['duration'];
  //         let event_with_trip = {
  //           id: eventd['id'],
  //           summary: eventd['summary'],
  //           location: eventd['location'],
  //           startTime: eventd['startTime'],
  //           endTime: eventd['endTime'],
  //           happening: eventd['happening'],
  //           trip_duration: duration['value'],
  //           mode: eventd['mode'],
  //         };
  //         this.eventListWithTrip.push(event_with_trip);
  //         this.eventListWithTrip.sort((a:any, b:any) => {
  //           if(a.startTime < b.startTime) {
  //             return -1;
  //           }
  //           else if(a.startTime > b.startTime) {
  //             return 1;
  //           }
  //           else {
  //             return 0;
  //           }
  //         });
  //         // Store for offline use...add to this later on....
  //         this.storage.setItem('lastKnownLocation', {origin: suc['origin_addresses']});
  //
  //         // Check if for loop is done; if done, call to resolve
  //         console.log("Events::getTodaysEvents(): modEventList length is:", modEventList.length);
  //         if (counter === modEventList.length){
  //           this.storage.setItem('eventWithTrip', JSON.stringify(this.eventListWithTrip));
  //           resolve(this.forLoopIsFinished(this.eventListWithTrip));
  //         };
  //       }, (error) => {
  //         console.log('Events::getTodaysEvents(): failed to get distance:', error);
  //       });
  //     };
  //   });
  // }
  //
  // forLoopIsFinished(events: any){
  //   return new Promise(resolve => {
  //     resolve(events);
  //   });
  // }
}
