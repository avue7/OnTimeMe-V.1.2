import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule,  AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { CalendarEventsService } from '../services/calendar-events.service';
import { GoogleCalendarService } from '../services/google-calendar.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseService } from 'src/services/database.service';
import { MapService } from 'src/services/map.service';
import { TransModeService } from 'src/services/trans-mode.service';
import { NativeCalendarService } from 'src/services/native-calendar.service';
import { Calendar } from '@ionic-native/calendar/ngx';
import { NetworkService } from 'src/services/network.service';
import { Network } from '@ionic-native/network/ngx';
import { HomePage } from 'src/home/home.page';


@NgModule({
  declarations: [
    AppComponent,
    HomePage
  ],
  entryComponents: [
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    GooglePlus,
    AngularFireAuth,
    AuthService,
    CalendarEventsService,
    GoogleCalendarService,
    HttpClient,
    DatabaseService,
    MapService,
    TransModeService,
    AlertController,
    NativeCalendarService,
    Calendar,
    NetworkService,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
    // {provide: ErrorHandler, useClass: IonicErrorHandler},

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
