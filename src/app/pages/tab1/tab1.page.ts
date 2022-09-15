import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AlertController } from '@ionic/angular';

import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx/';

import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from '../../services/toast/toast.service';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  userData : any
  loggedInUser: {}
  walletDetails: any;
  walletBalance: number;
  balanceData = 0;

  bgcolor: string = 'white';

  text_sentences = [];

  greetingMessage: any;

  constructor(public router: Router, 
    public alertController: AlertController,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private ionLoader: LoaderService,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech) {

      this.greetingMessage =  this.getGreeting();

      this.getUserDetails();

      this.text_sentences = [
        "I'm VERB, a voice-enabled fintech mobile app that could change digital banking"
      ]

    }

    ngOnInit() {
      this.speechRecognition.hasPermission()
        .then((hasPermission: boolean) => {
  
          if (!hasPermission) {
          this.speechRecognition.requestPermission()
            .then(
              () => console.log('Granted'),
              () => console.log('Denied')
            )
          }
        });
    }

    getGreeting() {
      var d = new Date();
      var time = d.getHours();
  
      if (time < 12) {
        return "Good morning,";
      }
      if (time > 12 && time < 17) {
        return "Good afternoon,";
      }
      if (time >= 17  && time <= 23) {
        return "Good evening,";
      }
      if (time == 12) {
        return "Good day,";
      }
    }

    start() {
      let options ={
        language:'en-US'
      }
      this.speechRecognition.startListening(options)
        .subscribe((matches: Array<string>) => {
            this.bgcolor = matches[0];
            // if(matches[0] === "What is my account balance" || matches[0] === "What is my account balance") {
            //   this.textToSpeech("Please wait! Checking your account balance");  
            //   setTimeout(() => {
            //     this.textToSpeech("Your account balance is Five Million Naira");
            //   }, 1500);
            // }
        },
      (onerror) => console.log('error:', onerror))
    }


    textToSpeech(text) {
      this.tts.speak(text)
        .then(() => console.log('Success'))
        .catch((reason: any) => console.log(reason));
    }


    async getUserDetails() {
      const returnedData = await this.storageService.get(AuthConstants.AUTH)
      this.userData = returnedData?.info;
      this.getUserWallet(this.userData?.phone);
      console.log("loggedin details:::", this.userData);
      return this.userData;
    }

    async getBalance() {
      const returnedData = await this.storageService.get(AuthConstants.WALLETBALANCE)
      this.balanceData = (returnedData == null || returnedData == undefined || returnedData == "" ) ? 0 : returnedData;
      this.walletBalance = this.balanceData;
      console.log("balanceData details:::", this.balanceData);
      return this.balanceData;
    }

    async getUserWallet(phone) {
      console.log("loggedin phone:::", phone);
      this.authService.getApiUrl("/balance/"+phone).subscribe((res: any) => {
          console.log("get wallet balance:::", res)
          // this.hideLoader();
          if (res.success) {
            this.walletDetails = res.data;
            this.walletBalance = this.walletDetails?.amount ? this.walletDetails?.amount : 0;
          } else {
            console.log("wallet else :", res)
            this.walletBalance = 0;
          }
        },
        (error: any) => {
          console.log("wallet error :", error)
          // this.hideLoader();
          // this.presentAlert(error?.error?.message);
          // this.toastService.presentToast(error?.error?.message);
        }
      );
    }

    doRefresh(refresher) {
      console.log('Begin async operation', refresher);
      this.getUserWallet(this.userData?.phone);
      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.target.complete();
      }, 3000);
    }

}
