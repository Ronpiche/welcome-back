import { Injectable } from '@nestjs/common';
import { version } from '../package.json';

@Injectable()
export class AppService {
  getHealth(): string {
    return `Welcome back version: ${version}`;
  }
}
