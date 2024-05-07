import { Address } from '../types/address.type';
import { MailAddress } from '../types/mailAddress.type';

export class User {
  _id: string;
  lastName: string;
  firstName: string;
  address: Address;
  birthPlace: string;
  socialSecurityNumber: number;
  position: string;
  experience: string;
  mailAddress: MailAddress;
}
