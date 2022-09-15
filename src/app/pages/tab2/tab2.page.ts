import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx/';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  userData : any
  loggedInUser: {}
  showVolume = true;
  walletDetails: any;
  walletBalance: number;
  balanceData = 0;

  processedData: any;

  dictionary = ["account balance", 
              "balance", 
              "current balance", 
              "what's my current balance",
              "last transaction",
              "last transaction history",
              "when was my last transaction",
              "when was my most recent transfer",
              "when was my most recent transaction",
              "who did I transfer last to",
              "what is my last transaction",
              "what is my last transaction history",
              "what is my account balance",
              "what's my account balance",
              "i want to ask about balance enquiry",
              "i want to ask about my account balance",
              "what's my current account balance"]

  constructor(public router: Router, 
    private authService: AuthService,
    private storageService: StorageService,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech) {
      
      this.getUserDetails();
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

  async getUserDetails() {
    const returnedData = await this.storageService.get(AuthConstants.AUTH)
    this.userData = returnedData?.info;
    this.getUserWallet(this.userData?.phone);
    console.log("loggedin details:::", this.userData);
    return this.userData;
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

  speakOut(text) {
    this.tts.speak(text).then(() => {
      console.log('Welcome Success')
      this.showVolume = true;
    })
    .catch((reason: any) => console.log(reason));
  }

  onPressedSpeech() {
   //  this.speakOut("Hi " + this.userData?.firstName + ", what can I do for you?");
    console.log("You pressed this");
    this.showVolume = false;
    this.startVerbing();
  }

  onStopSpeech() {
    console.log("You released this");
    this.showVolume = true;
    
    // if(this.processedData.length > 0) {
    //   if(this.processedData === "What is my account balance" || this.processedData === "What is my account balance") {
    //     this.speakOut("Please wait! Checking your account balance");  
    //     setTimeout(() => {
    //       this.speakOut("Your account balance is Five Million Naira");
    //     }, 1000);
    //   }
    // }

  }

  startVerbing() {
    this.speechRecognition.startListening().subscribe((matches: Array<string>) => {
      this.processedData = matches[0];
      // alert("result::"+ this.processedData);

      if(this.dictionary.includes(this.processedData.toLowerCase())) {
        // this.speakOut("Please wait! Checking your account balance");
        if(this.processedData.includes("balance")) {
            this.speakOut(this.userData?.firstName + ", Your account balance is "+ this.walletDetails?.amount+ " Naira");
            this.onStopSpeech();
        } else if (this.processedData.includes("transaction")) {
          // setTimeout(() => {
            const receiver = "Olakemi Bolade";
            const tranxDate = "22/08/2022";
            const tranxAmount = "5,100"
            this.speakOut("You transferred "+ tranxAmount+"Naira to "+ receiver+ " on "+tranxDate);
            setTimeout(() => {
              this.onStopSpeech();
            }, 4000);
        }
        setTimeout(() => {
          this.onStopSpeech();
        }, 4000);
      } else {
        this.speakOut(
          "Sorry! I didn't get your question. " +
          "You can ask questions related to account balance or your last transaction history"
        );
      }
      setTimeout(() => {
        this.onStopSpeech();
      }, 4000);
    },
    (onerror) => { 
      alert('error::'+ onerror);
      console.log('error:', onerror) 
    })
  }


}
