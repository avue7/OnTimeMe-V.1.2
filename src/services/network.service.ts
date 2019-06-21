import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  functionality: boolean = false;

  constructor(
    private toast: ToastController
  ) { }

  enableFunctionality(){
    this.functionality = true;
  }

  disableFunctionality(){
    this.functionality = false;
  }

  async onConnectUpdate(connectionState: string, networkType: any){
    let onToast = await this.toast.create({
      message: 'You are now ' + connectionState + ' via ' + networkType,
      duration: 3000
    });
    onToast.present();
  }

  async onDisconnectUpdate(){
    let offToast = await this.toast.create({
      message: 'You are offline. You will not be able to make new requests',
      position: 'bottom',
      duration: 4000
    });
    offToast.present();
  }
}
