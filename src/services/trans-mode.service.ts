import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './auth.service';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TransModeService {

  constructor(
    private nativeStorage: NativeStorage,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) { }

  setAllEventMode(transMode?: any, titleParam?: any, messageParam?: any){
    return new Promise(async resolve => {
      // If no transmode yet, default to driving
      if(!transMode){
        transMode = 'driving'
      };

      let allEvent: boolean = true;
      const modeArray = ['driving', 'bicycling', 'walking'];

      let alert = await this.alertCtrl.create({
        header: titleParam,
        message: messageParam,
        backdropDismiss: false,
        inputs: [
          {
            name: 'driving',
            type: 'radio',
            label: 'Driving',
            value: 'driving',
            checked: transMode == 'driving'
          },
          {
            name: 'bicycling',
            type: 'radio',
            label: 'Bicycling',
            value: 'bicycling',
            checked: transMode == 'bicycling'
          },
          {
            name: 'walking',
            type: 'radio',
            label: 'Walking',
            value: 'walking',
            checked: transMode == 'walking'
          }
        ],
        buttons: [
          {
            text: 'OK',
            role: 'ok',
            cssClass: '',
            handler: (data) => {
              if(data != null){
                alert.dismiss().then(() => {
                  resolve(this.storeMode(data, allEvent));
                });
              } else {
                let mustMessage = "You must select a default mode of transportation";
                resolve(this.setAllEventMode(transMode, titleParam, mustMessage));
              }
            }
          }
        ]
      });
      alert.present();
    });
  }

  changeAllEventMode(transMode?: any, titleParam?: any, messageParam?: any){
    return new Promise(async resolve => {
      // If no transmode yet, default to driving
      if(!transMode){
        transMode = 'driving'
      };

      let allEvent: boolean = true;
      const modeArray = ['driving', 'bicycling', 'walking'];

      let alert = await this.alertCtrl.create({
        header: titleParam,
        message: messageParam,
        backdropDismiss: false,
        inputs: [
          {
            name: 'driving',
            type: 'radio',
            label: 'Driving',
            value: 'driving',
            checked: transMode == 'driving'
          },
          {
            name: 'bicycling',
            type: 'radio',
            label: 'Bicycling',
            value: 'bicycling',
            checked: transMode == 'bicycling'
          },
          {
            name: 'walking',
            type: 'radio',
            label: 'Walking',
            value: 'walking',
            checked: transMode == 'walking'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: '',
            handler: () => {
              console.log("User cancel change all event mode");
              resolve();
            }
          },
          {
            text: 'Confirm',
            role: 'confirm',
            cssClass: '',
            handler: (data) => {
              // if(data != null){
                alert.dismiss().then(() => {
                  resolve(this.storeMode(data, allEvent));
                });
              // } else {
              //   let mustMessage = "You must select a default mode of transportation";
              //   resolve(this.setAllEventMode(transMode, titleParam, mustMessage));
              // }
            }
          }
        ]
      });
      alert.present();
    });
  }

  getAllEventMode(): any{
    return new Promise(resolve => {
      let userId = this.auth.getUserId();
      this.nativeStorage.getItem(userId).then(mode => {
        console.log("Getting all event transmode", mode);
        resolve(mode.allEventMode);
      }, error => {
        resolve(null)
      });
    });
  }

  storeMode(modeParam: any, allEventFlag?: any){
    return new Promise(resolve => {
      let userId = this.auth.getUserId();

      if(allEventFlag){
        console.log("Setting all event transmode to", modeParam);
        this.nativeStorage.setItem(userId, {
          allEventMode: modeParam
        }).then(async () => {
          const toast = await this.toast.create({
            message: 'Transportation mode for all events is now \"' + modeParam + '\"',
            position: 'bottom',
            duration: 4000
          })
          toast.present();
          resolve(true);
        });
      } else {
        console.log("Setting event transmode to", modeParam);
        resolve(false);
      };
    });
  }
}
