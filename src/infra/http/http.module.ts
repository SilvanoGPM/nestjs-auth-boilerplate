import { Module } from '@nestjs/common';

import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { GenericModule } from './modules/generic.module';

@Module({
  imports: [GenericModule, UserModule, AuthModule],
  controllers: [UserController, AuthController],
})
export class HttpModule {}
