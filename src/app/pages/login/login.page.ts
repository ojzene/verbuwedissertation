import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AlertController } from '@ionic/angular';

import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from '../../services/toast/toast.service';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // postData = {
  //   phone: '',
  //   password: ''
  // };
  postData = {
    phone: '07908812603',
    password: '1245'
  };
  constructor(public router: Router, public alertController: AlertController,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private ionLoader: LoaderService) { }

  ngOnInit() {}

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Login',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

  validateInputs() {
    let phone = this.postData.phone.trim();
    let password = this.postData.password.trim();
    return (
      this.postData.phone &&
      this.postData.password &&
      phone.length > 0 &&
      password.length > 0
    );
  }

  loginAccount() {
    if (this.validateInputs()) {
      this.showLoader();
      this.authService.login(this.postData).subscribe((res: any) => {
        console.log("login result :", res)
          this.hideLoader();
          if (res.success) {
            this.storageService.store(AuthConstants.AUTH, res.data);
            this.storageService.store(AuthConstants.AUTHPHONE, res.data.phone);
            this.router.navigate(['/tabs']);
          } else {
            this.presentAlert('incorrect password.');
            this.toastService.presentToast('Incorrect username and password.');
          }
        },
        (error: any) => {
          console.log("login error :", error)
          this.hideLoader();
          this.presentAlert(error?.error?.message);
          this.toastService.presentToast(error?.error?.message);
        }
      );
    } else {
      // this.presentAlert('Phone or Pincode cannot be empty.');
      this.toastService.presentToast('Please enter Phone number and Pin code');
    }
  }

  showLoader() {
    this.ionLoader.showLoader();
    setTimeout(() => {
      this.hideLoader();
    }, 3000);
  }

  hideLoader() {
    this.ionLoader.hideLoader();
  }

}
