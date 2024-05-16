import { BadRequestException, Injectable, Logger, PipeTransform } from "@nestjs/common";
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Injectable()
export class FindAllUsersPipe implements PipeTransform {
    constructor(
        private readonly logger: Logger,
    ){}
    transform(arrivalDate: any) {
        let filter: any = {};
        if(arrivalDate){
            let { startDate, endDate } = arrivalDate;
            if (startDate) {
              if (dayjs(startDate, "DD/MM/YYYY", true).isValid()) {
                let startMoment = dayjs(startDate, "DD/MM/YYYY", true);
                filter = {
                  ...filter,
                  arrivalDate: {
                    ...filter.arrivalDate,
                    $gte: startMoment.format("YYYY-MM-DD"),
                  },
                };
                this.logger.log("[findAllUsersPipe] - add startDate in filter", JSON.stringify(filter));
              } else {
                this.logger.error("[findAllUsersPipe] - Invalid arrivalDate startDate")
                throw new BadRequestException("Invalid arrivalDate startDate")
              }
            }
            if (endDate) {
              if (dayjs(endDate, "DD/MM/YYYY", true).isValid()) {
                let endMoment = dayjs(endDate, "DD/MM/YYYY", true);
                filter = {
                  ...filter,
                  arrivalDate: {
                    ...filter.arrivalDate,
                    $lte: endMoment.format("YYYY-MM-DD"),
                  },
                };
                this.logger.log("[findAllUsersPipe] - add endDate in filter", JSON.stringify(filter));
              } else {
                this.logger.error("[findAllUsersPipe] - Invalid arrivalDate endDate")
                throw new BadRequestException("Invalid arrivalDate endDate")
              }
            }
        }
        return filter;
    }
}