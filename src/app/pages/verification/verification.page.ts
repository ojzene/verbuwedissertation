import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  otp = { a: '', 
          b: '', 
          c: '', 
          d: '', 
          e: '', 
          f: '' }
  phoneNumber: any;
  emailAddress: any;
  userDetails: any;
  constructor(private authService: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router) { 
      if (this.router.getCurrentNavigation().extras.state) {
        const routeState = this.router.getCurrentNavigation().extras.state;
        if (routeState) {
          this.userDetails = routeState.details ? JSON.parse(routeState.details) : '';
          this.phoneNumber = routeState.phone ? routeState.phone : '';
          this.emailAddress = routeState.email ? routeState.email : '';
        }
      }
      console.log("userDetails:::", this.userDetails);
      console.log("user Phone:::", this.phoneNumber);
      console.log("user Email:::", this.emailAddress);
    }

  ngOnInit() {
  }

  moveFocus(event, nextElement, previousElement) {
    console.log(event.keyCode);
    if (event.keyCode === 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else if (event.keyCode >= 96 && event.keyCode <= 105) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = '';
    }
  }

  validateInputs() {
    // console.log(this.otp);
    let a = this.otp.a.trim();
    let b = this.otp.b.trim();
    let c = this.otp.c.trim();
    let d = this.otp.d.trim();
    let e = this.otp.e.trim();
    let f = this.otp.f.trim();
    return (
      this.otp.a &&
      this.otp.b &&
      this.otp.c &&
      this.otp.d &&
      this.otp.e &&
      this.otp.f &&
      a.length > 0 &&
      b.length > 0 &&
      c.length > 0 &&
      d.length > 0 &&
      e.length > 0 &&
      f.length > 0
    );
  }

  confirmVerify() {
    const joined = Object.values(this.otp).join('');
    console.log(joined)
    console.log(joined.length)
    if (this.validateInputs()) {
      const otpDetails = {
        phone: this.phoneNumber,
        otpCode: joined,
        otpType: "verification"
      }
      this.authService.verify(otpDetails).subscribe(
        (res: any) => {
          console.log("verify res:::", res)
          if (res.success) {
            this.storageService.store(AuthConstants.AUTH, res.data).then(res => {
                this.router.navigate(['/setpin'], {
                  state: {
                    details: this.userDetails,
                    phone: this.phoneNumber,
                    email: this.emailAddress
                  }
                });
            });
          } else {
            this.toastService.presentToast(
              'Verification already exists, please enter new details.'
            );
          }
        },
        (error: any) => { 
          console.log("verify error:::", error)
          this.toastService.presentToast('Network Issue.');
        }
      );
      // this.router.navigate(['/setpin']);
    } else {
      this.toastService.presentToast(
        'Please complete otp values.'
      );
    }
  }

}
