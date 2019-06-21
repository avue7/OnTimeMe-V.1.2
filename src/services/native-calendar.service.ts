import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { Platform } from '@ionic/angular';

// DEBUG: TEsting background services
// import android.app.ActivityManager;
// import android.content.Context;
// import android.content.Intent;
// import android.os.Bundle;
// import android.support.v7.app.AppCompatActivity;
// import android.util.Log;

@Injectable({
  providedIn: 'root'
})
export class NativeCalendarService {

  constructor(
    private calendar: Calendar,
    private plt: Platform
  ) { }

  openCalendar(){
    let now = new Date()
    this.calendar.openCalendar(now).then((res) => {
      console.log("Openning calendar????", res)
    })
  }

  getTodaysEventsEvent(){
    // Check for android ios
    if(this.plt.is('android')){
      let start = new Date();
      let end = new Date();
      // Get only next 24 hours
      end.setDate(end.getDate() + 1);
      end.setHours(end.getHours() + 1);
      // end.setDate(end);
      console.log("Date for enddate is", end)
      this.calendar.listEventsInRange(start, end).then(list => {
        console.log("Calendar is in native is", list);
      })
    }

    // this.calendar.

  }

}
