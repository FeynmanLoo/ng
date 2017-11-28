import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'questionType'
})
export class QuestionTypePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    let result: string;
    switch(value){
      case 0:result = '单选题';break;
      case 1:result = '多选题';break;
      case 2:result = '必对题';break;
      case 3:result = '填空题';break;
      default:'未知';
    }
    return result;
  }

}
