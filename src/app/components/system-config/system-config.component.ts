import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api/api.service';
import {NzNotificationService} from 'ng-zorro-antd';
@Component({
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css']
})
export class SystemConfigComponent implements OnInit {
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  editRow = null;
  tempEditObject = {};
  constructor(private _apiService: APIService, private _notification :NzNotificationService) {
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this._apiService.getSystemConfigs(this._current, this._pageSize).subscribe((data: any) => {
      this._loading = false;
      this._total = data.totalCount;
      this._dataSet = data.dataSet;
    })
  };

  edit(data) {
    this.tempEditObject[ data.id ] = { ...data };
    this.editRow = data.id;
  }

  save(data) {
    Object.assign(data, this.tempEditObject[ data.id ]);
    this.editRow = null;
    this._apiService.updateSystemConfig(data).subscribe((ErrMsg: string)=>{
      if(ErrMsg){
        this._notification.create('error', '操作失败', ErrMsg);
      }else{
        this._notification.create('success', '操作成功', ErrMsg);
      }
    })
  }

  cancel(data) {
    this.tempEditObject[ data.id ] = {};
    this.editRow = null;
  }

  ngOnInit() {
    this.refreshData();
  }

}
