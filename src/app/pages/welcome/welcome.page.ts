import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx/';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  welcomeText = "Welcome to Verb, What can I do for you today?"

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  headerTitle = "SEND MONEY";
  subHeaderTitle = "With Verb Send money to your friends with your voice.";

  showVolume = false;

  processedData: any;

  constructor(private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech) {
      this.welcomeSpeech();
    }

  slidesDidLoad(slides: IonSlides): void {
    slides.startAutoplay();
  }

  changeText(slides) {
    slides.getActiveIndex().then(res => {
      if(res == 0) {
        this.headerTitle = "SEND MONEY";
        this.subHeaderTitle = "With Verb Send money to your friends with your voice.";
      } else if (res == 1) {
        this.headerTitle = "CHECK BALANCE"
        this.subHeaderTitle = "With Verb check your current balance without stress.";
      } else if (res == 2) {
        this.headerTitle = "TRANSACTION HISTORY";
        this.subHeaderTitle = "With Verb get the history of your recent transaction.";
      }
    });
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

  welcomeSpeech () {
    const myGreetings = this.getGreeting();
    this.speakOut(myGreetings +" "+ this.welcomeText);
  }

  speakOut(text) {
    this.tts.speak(text)
      .then(() => console.log('Welcome Success'))
      .catch((reason: any) => console.log(reason));
  }

  onLongPressSpeech() {
    console.log("You long pressed this");
    this.showVolume = false;
  }

  releasedSpeech() {
    console.log("You released this");
    this.showVolume = true;
    this.start();

    if(this.processedData.length > 0) {
      if(this.processedData === "What is my account balance" || this.processedData === "What is my account balance") {
        this.speakOut("Please wait! Checking your account balance");  
        setTimeout(() => {
          this.speakOut("Your account balance is Five Million Naira");
        }, 1000);
      }
    }

  }

  showSpeech() {
    this.showVolume = false;
  }

  pressed() {
    alert("You pressed this");
  }

  getGreeting() {
    var d = new Date();
    var time = d.getHours();

    if (time < 12) {
      return "Good morning!";
    }
    if (time > 12 && time < 17) {
      return "Good afternoon!";
    }
    if (time >= 17  && time <= 23) {
      return "Good evening!";
    }
    if (time == 12) {
      return "Good day!";
    }
  }

  start() {
    this.speechRecognition.startListening()
    .subscribe((matches: Array<string>) => {
          this.processedData = matches[0];
          alert("result::"+ this.processedData);
      },
    (onerror) => { 
      alert('error::'+ onerror);
      console.log('error:', onerror) 
  })
  }


}
