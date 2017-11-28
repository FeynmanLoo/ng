import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

import 'rxjs/add/operator/switchMap';
import {NzNotificationService, NzModalService} from 'ng-zorro-antd';

import { APIService } from '../../services/api/api.service';

interface SurveyData {
  survey: any,
  questions: any,
}

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.css']
})
export class SurveyDetailComponent implements OnInit {
    validateForm: FormGroup;
    data: SurveyData = {
      survey: {},
      questions: []
    } as SurveyData;

    loading = false;

    _submitForm() {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[ i ].markAsDirty();
      }
      console.log(this.data);
      // if(this.validateForm.valid){
      //   this.surveyService.createOrUpdate(this.data).subscribe((result: any) => {
      //     if(result.errorMsg){
      //       this._notification.create('error', '操作失败', result.errorMsg);
      //     }else{
      //       this._notification.create('success', '操作成功', result.errorMsg);
      //     }
      //   });
      // }
    }
    addQuestion(type, e?: MouseEvent) {
      if (e) {
        e.preventDefault();
      }
      if (type < 0) return;
      const questionNo = (this.data.questions.length > 0) ? this.data.questions[this.data.questions.length - 1].questionNo+ 1 : 0;
  
      const question = {
        controlInstance: this.newGuid(),
        questionNo: questionNo,
        questionType: type,
        description: '',
        options:[],
        standardAnswer: '',
        standardAnswerInstance: this.newGuid(),
      };
      const index = this.data.questions.push(question);
      this.validateForm.addControl(this.data.questions[index - 1].controlInstance, new FormControl(null, Validators.required));
      switch(type){
        case 0:
        case 1:this.addOption(question,e);break;
        case 2:{
          this.validateForm.addControl(this.data.questions[index - 1].standardAnswerInstance, new FormControl(null, Validators.required));
          this.addOption(question,e);
        };break;
      }
    }
  
    removeQuestion(i, e: MouseEvent) {
      e.preventDefault();
      if (this.data.questions.length > 1) {
        let that = this;
        this.confirmServ.confirm({
          title  : '您是否确认要删除吗？',
          content: '<b>确定了就删吧~~</b>',
          onOk() {
            const index = that.data.questions.indexOf(i);
            that.data.questions.splice(index, 1);
            that.validateForm.removeControl(i.controlInstance);
            if(i.questionType == 2) that.validateForm.removeControl(i.standardAnswerInstance);
          },
          onCancel() {
          }
        });
      }
    }
    addOption(q, e?: MouseEvent) {
      if (e) {
        e.preventDefault();
      }
      const optionNo = (q.options.length > 0) ? q.options[q.options.length - 1].optionNo+ 1 : 0;
  
      const option = {
        controlInstance: this.newGuid(),
        optionNo: optionNo,
        optionContent: '',
      };
      const index = q.options.push(option);
      this.validateForm.addControl(q.options[index - 1].controlInstance, new FormControl(null, Validators.required));
    }

    removeOption(q, o, e: MouseEvent) {
      e.preventDefault();
      if (q && q.options.length > 1) {
        let that = this;
        this.confirmServ.confirm({
          title  : '您是否确认要删除吗？',
          content: '<b>确定了就删吧~~</b>',
          onOk() {
            const index = q.options.indexOf(o);
            q.options.splice(index, 1);
            this.validateForm.removeControl(o.controlInstance);
          },
          onCancel() {
          }
        });
      }
    }

    newGuid(){
      var guid = "";
      for (var i = 1; i <= 32; i++){
        var n = Math.floor(Math.random()*16.0).toString(16);
        guid +=   n;
        if((i==8)||(i==12)||(i==16)||(i==20))
          guid += "-";
      }
      return guid; 
    }

    constructor(private fb: FormBuilder, private route: ActivatedRoute, private _apiService: APIService, private _notification: NzNotificationService, private confirmServ: NzModalService) {
    }
  
    // updateConfirmValidator() {
    //   /** wait for refresh value */
    //   setTimeout(_ => {
    //     this.validateForm.controls[ 'checkPassword' ].updateValueAndValidity();
    //   });
    // }
  
    // confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    //   if (!control.value) {
    //     return { required: true };
    //   } else if (control.value !== this.validateForm.controls[ 'password' ].value) {
    //     return { confirm: true, error: true };
    //   }
    // };
  
    // getCaptcha(e: MouseEvent) {
    //   e.preventDefault();
    // }
  
    ngOnInit() {
      this.validateForm = this.fb.group({
        title            :[ null, [ Validators.required ] ],
        description      :[ null, [ Validators.required ] ],
        finishReward     :[ null, [ Validators.required ] ],
        firstReward      :[ null, [ Validators.required ] ],
        secondReward     :[ null, [ Validators.required ] ],


        // email            : [ null, [ Validators.email ] ],
        // password         : [ null, [ Validators.required ] ],
        // checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
        // nickname         : [ null, [ Validators.required ] ],
        // phoneNumberPrefix: [ '+86' ],
        // phoneNumber      : [ null, [ Validators.required ] ],
        // website          : [ null, [ Validators.required ] ],
        // captcha          : [ null, [ Validators.required ] ],
        // agree            : [ false ]
      });
      this.loading = true;
      this.route.paramMap
      .switchMap((params: ParamMap) => this._apiService.getSurvey(params.get('id')))
      .subscribe((data: SurveyData) => {
        for(let i =0; i < data.questions.length; i++){
          let question = data.questions[i];
          question.controlInstance = `question${question.id}${question.questionNo}`;
          this.validateForm.addControl(question.controlInstance, new FormControl(null, Validators.required));
          if(question.questionType >=0 && question.questionType <=2){
            for(let j = 0; j < question.options.length; j++){
              let option = question.options[j];
              option.controlInstance = `${question.controlInstance}option${option.optionNo}`;
              this.validateForm.addControl(option.controlInstance, new FormControl(null, Validators.required));
            }
            if(question.questionType == 2){
              question.standardAnswerInstance = `questionStandardAnswer${question.id}${question.questionNo}`;
              this.validateForm.addControl(question.standardAnswerInstance, new FormControl(null, Validators.required));

              question.tipsUrlInstance = `questiontipsUrl${question.id}${question.questionNo}`;
              this.validateForm.addControl(question.tipsUrlInstance, new FormControl(null, Validators.required));
            }
          }
        }
        this.data = data;
        let that = this;
        setTimeout(function() {
          that.loading = false;
        }, 2000);
      });
    }
  
    getFormControl(name) {
      return this.validateForm.controls[ name ];
    }

}
