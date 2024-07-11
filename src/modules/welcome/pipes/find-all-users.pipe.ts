import { Injectable, PipeTransform } from '@nestjs/common';
import { Filter } from '@google-cloud/firestore';

@Injectable()
export class FindAllUsersPipe implements PipeTransform {
  transform(arrivalDate: any) {
    const filters = [];
    if (!arrivalDate) {
      return filters;
    }
    if (arrivalDate.startDate) {
      filters.push(Filter.where('arrivalDate', '>=', arrivalDate.startDate));
    }
    if (arrivalDate.endDate) {
      filters.push(Filter.where('arrivalDate', '<', arrivalDate.endDate));
    }
    return Filter.and(...filters);
  }
}
