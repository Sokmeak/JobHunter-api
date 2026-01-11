import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStarted(): string {
    return 'Welcome to JobHunter Team! This is the backend service for the JobHunter application.';
  }
}
