import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from '../../services/toast/toast.service';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  postData = {
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  };
  constructor(private authService: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router,
    private ionLoader: LoaderService) { }

  ngOnInit() {
  }

  validateInputs() {
    console.log(this.postData);
    let firstName = this.postData.firstName.trim();
    let lastName = this.postData.lastName.trim();
    let phone = this.postData.phone.trim();
    let email = this.postData.email.trim();
    return (
      this.postData.firstName &&
      this.postData.lastName &&
      this.postData.phone &&
      this.postData.email &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      phone.length > 0
    );
  }

  signupAction() {
    if (this.validateInputs()) {
      this.showLoader();
      this.authService.signup(this.postData).subscribe((res: any) => {
          console.log("reg res:::", res)
          this.hideLoader();
          if (res.success) {
            // Storing the User data.
            this.storageService.store(AuthConstants.AUTH, res.data).then(res => {
                this.router.navigate(['/verification'], {
                  state: {
                    details: JSON.stringify(this.postData),
                    phone: this.postData.phone,
                    email: this.postData.email
                  }
                });
            });
          } else {
            this.toastService.presentToast(
              'Data already exists, please enter new details.'
            );
          }
        },
        (error: any) => { 
          this.hideLoader();
          console.log("reg error:::", error)
          this.toastService.presentToast(error.message);
        }
      );
      // this.router.navigate(['/verification']);
    } else {
      this.toastService.presentToast(
        'Please fill all necessary fields.'
      );
    }
  }

  showLoader() {
    this.ionLoader.showLoader();
    setTimeout(() => {
      this.hideLoader();
    }, 2000);
  }

  hideLoader() {
    this.ionLoader.hideLoader();
  }

}
