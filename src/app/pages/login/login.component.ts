
// // import { Component } from '@angular/core';
// // import { FormBuilder, Validators } from '@angular/forms';
// // import { Router } from '@angular/router';

// // @Component({
// //   selector: 'app-login',
// //   templateUrl: './login.component.html',
// //   styleUrls: ['./login.component.css']
// // })
// // export class LoginComponent {
// //   loading=false;
// //   loginForm=this.fb.group({
// //     email:['',[Validators.required,Validators.email]],
// //     password:['',Validators.required]
// //   });
// //   constructor(private fb:FormBuilder, private router:Router){}
// //   submit(){
// //     if(this.loginForm.invalid)return;
// //     this.loading=true;
// //     setTimeout(()=>{
// //       this.loading=false;
// //       this.router.navigate(['/dashboard']);
// //     },1000);
// //   }
// // }


// import { Component } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   loading = false;
//   error = '';
//   showPassword = false;

//   loginForm = this.fb.group({
//     email: ['', Validators.required],
//     password: ['', Validators.required]
//   });

//   constructor(private fb: FormBuilder, private router: Router) {}

//   submit() {
//     if (this.loginForm.invalid) return;

//     this.loading = true;
//     this.error = '';

//     // Simulate API (replace with real API call)
//     setTimeout(() => {
//       this.loading = false;
//       this.router.navigate(['/dashboard']);
//     }, 1000);
//   }
// }


import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loading = false;
  error = '';
  showPassword = false;

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  submit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err:any) => {
        this.loading = false;
        this.error =
          err?.error?.message || 'Invalid login credentials';
      }
    });
  }
}
