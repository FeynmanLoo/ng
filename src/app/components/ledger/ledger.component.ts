import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api/api.service';
import {NzNotificationService, NzModalService} from 'ng-zorro-antd';
import { FileSaverService } from 'ngx-filesaver';
@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortField = null;
  _sortValue = null;
  _searchValue = null;
  constructor(private _apiService: APIService,
    private modalService: NzModalService,
    private _notification: NzNotificationService,
    private _FileSaverService: FileSaverService) {
  }
  search() {
    this.refreshData(true);
  }
  sort(sortName, value) {
    this._sortField = sortName;
    this._sortValue = value;
    this.refreshData();
  }
  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this._apiService.getLedgers(null, this._current, this._pageSize, this._sortField, this._sortValue, this._searchValue).subscribe((data: any) => {
      this._loading = false;
      this._total = data.totalCount;
      this._dataSet = data.dataSet;
    })
  };

  currentModal;
  isConfirmLoading = false;
  exportExcel = {
    timeFlag: true,
    beginTime: null,
    endTime: null
  };
  showModalForTemplate(titleTpl, contentTpl, footerTpl) {
    let that = this;
    this.currentModal = this.modalService.open({
      title       : titleTpl,
      content     : contentTpl,
      footer      : footerTpl,
      maskClosable: false,
      onOk() {
        that._apiService.exportLedger(that.exportExcel.beginTime, that.exportExcel.endTime).subscribe((res:any) => {
          let filename = res.headers.get('Content-Disposition').split("filename*=UTF-8''")[1];
          that._FileSaverService.save(res.body, filename, that._FileSaverService.genType(filename));
          that._notification.create('success', '操作成功', "666");
        });;
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

  ngOnInit() {
    this.refreshData();
  }

}
