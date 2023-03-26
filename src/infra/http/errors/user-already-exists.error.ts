import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExists extends BadRequestException {
  constructor(email: string) {
    super('User already exists', {
      cause: new Error(),
      description: `User already exists with email: [${email}]`,
    });
  }
}
