import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api/api.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortValue = null;
  _filterGender = [
    { name: '全部', value: false },
    { name: '男', value: false },
    { name: '女', value: false }
  ];

  sort(value) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }

  constructor(private _apiService: APIService) {
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    const selectedGender = this._filterGender.filter(item => item.value).map(item => item.name);
    this._apiService.getSurveys(this._current, this._pageSize, 'name', this._sortValue, selectedGender).subscribe((data: any) => {
      this._loading = false;
      this._total = data.totalCount;
      this._dataSet = data.dataSet;
    })
  };

  ngOnInit() {
    this.refreshData();
  }

}
