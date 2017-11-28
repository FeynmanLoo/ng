import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { APIService } from '../../services/api/api.service';
import {NzNotificationService, NzModalService} from 'ng-zorro-antd';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  userId: string;
  user: any;
  account: any;
  userDetailValidateForm: FormGroup;
  settingsValidateForm: FormGroup;
  constructor(private router: ActivatedRoute, 
    private _apiService: APIService, 
    private fb: FormBuilder,
    private modalService: NzModalService,
    private _notification: NzNotificationService) { }

  _submitForm() {
    for (const i in this.settingsValidateForm.controls) {
      this.settingsValidateForm.controls[ i ].markAsDirty();
    }
    if (this.settingsValidateForm.valid) {
      console.log(this.settingsValidateForm.value);
      const data = this.settingsValidateForm.value;
      this._apiService.updateUser(this.userId, data.userStatus, data.accountStatus, data.description).subscribe((result: any) => {
        if (result.errMsg) {
          this._notification.create('error', '操作失败', result.errMsg);
        }else {
          this._notification.create('success', '操作成功', result.errMsg);
          this.user.userStatus = data.userStatus;
          this.account.accountStatus = data.accountStatus;
          this.user.remark = data.description;
        }
      });
    }
  }

  getUserDetailValidateFormControl(name) {
    return this.userDetailValidateForm.controls[ name ];
  }
  getSettingsValidateFormControl(name) {
    return this.settingsValidateForm.controls[ name ];
  }
  ngOnInit() {
    this.userId = this.router.snapshot.params['id'];
    this._apiService.getUser(this.userId).subscribe(data => this.user = data);
    this._apiService.getAccount(this.userId).subscribe(data => this.account = data);
    this.refreshData();
    this.userDetailValidateForm = this.fb.group({
      nickname         : [ null, [ Validators.required ] ],
      realname         : [ null, [ Validators.required ] ],
      telephone         : [ null, [ Validators.required ] ],
      thisLoginIP         : [ null, [ Validators.required ] ],
      thisLoginTime         : [ null, [ Validators.required ] ],
      lastLoginIP         : [ null, [ Validators.required ] ],
      lastLoginTime         : [ null, [ Validators.required ] ],
      userStatus        : [ null, [ Validators.required ] ],
      accountStatus        : [ null, [ Validators.required ] ],
      description        : [ null, [ Validators.nullValidator ] ]
    });
    this.settingsValidateForm = this.fb.group({
      userStatus        : [ null, [ Validators.required ] ],
      accountStatus        : [ null, [ Validators.required ] ],
      description        : [ null, [ Validators.nullValidator ] ]
    });
  }



  // 流水
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortField = null;
  _sortValue = null;
  _searchValue = null;
  _filterGender = [
    { name: '全部', value: false },
    { name: '男', value: false },
    { name: '女', value: false }
  ];

  sort(sortName, value) {
    this._sortField = sortName;
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }

  search() {
    this.refreshData(true);
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this._apiService.getLedgers(this.userId, this._current, this._pageSize, this._sortField, this._sortValue, this._searchValue).subscribe((data: any) => {
      this._loading = false;
      this._total = data.totalCount;
      this._dataSet = data.dataSet;
    })
  };
  currentModal;
  isConfirmLoading = false;
  modefy = {
    money: 0,
    remark: ''
  }
  showModalForTemplate(titleTpl, contentTpl, footerTpl) {
    let that = this;
    this.currentModal = this.modalService.open({
      title       : titleTpl,
      content     : contentTpl,
      footer      : footerTpl,
      maskClosable: false,
      onOk() {
        that._apiService.updateAccount(that.userId, that.modefy.money, that.modefy.remark).subscribe((data: any) => {
          if (data.errMsg) {
            that._notification.create('error', '操作失败', data.errMsg);
          }else {
            that._notification.create('success', '操作成功', data.errMsg);
            that.account.total += that.modefy.money * 100;
            that.modefy = {
              money: 0,
              remark: ''
            };
            that.reset();
          }
        });
      }
    });
  }
  handleOk(e) {
    this.isConfirmLoading = true;
    /* destroy方法可以传入onOk或者onCancel。默认是onCancel */
    this.currentModal.destroy('onOk');
    this.isConfirmLoading = false;
    this.currentModal = null;
  }
}
