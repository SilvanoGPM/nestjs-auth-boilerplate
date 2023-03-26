import { Injectable } from '@nestjs/common/decorators';

import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class IsUser extends JwtAuthGuard {
  constructor() {
    super(['user', 'admin']);
  }
}
