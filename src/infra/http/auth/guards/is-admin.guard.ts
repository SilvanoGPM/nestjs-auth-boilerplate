import { Injectable } from '@nestjs/common/decorators';

import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class IsAdmin extends JwtAuthGuard {
  constructor() {
    super(['admin']);
  }
}
