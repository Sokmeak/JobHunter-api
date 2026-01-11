import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptProvider extends HashingProvider {
  async hashPassword(password: string): Promise<string> {
    //const saltRounds = await bcrypt.genSalt(); // You can adjust the salt rounds as needed
    const saltRounds = 10;
    // Generate a salt and hash the password
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
