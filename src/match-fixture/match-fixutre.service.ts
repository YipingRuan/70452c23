import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchFixtureService {
  getHello(): string {
    return "Aloha";
  }
}
