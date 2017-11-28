import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../../services/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    validateForm: FormGroup;
    _submitForm() {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
      }
      if (this.validateForm.valid) {
        console.log(this.validateForm.value);
        this.service.getToken(this.validateForm.value.userName, this.validateForm.value.password).subscribe((data: any) => {
          if (data.errMsg) {
            alert(data.errMsg);
          }else {
            localStorage.setItem('token', JSON.stringify(data));
            alert('成功登陆');
            this.router.navigateByUrl('/');
          }
        });
      }
    }
  
    constructor(private fb: FormBuilder, private service: APIService, private router: Router) {
    }
  
    ngOnInit() {
      this.validateForm = this.fb.group({
        userName: [ null, [ Validators.required ] ],
        password: [ null, [ Validators.required ] ],
      });
    }

}
