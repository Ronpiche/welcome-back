import { EXCLUDED_GIVENNAMES, EXCLUDED_SURNAMES } from './constants';
import { MicrosoftUserDto } from './dto/microsoft.dto';
import { MsUser } from './types/microsoft.types';

export function formatUser(user: MicrosoftUserDto): MsUser {
  return {
    _id: user.id,
    email: user.mail,
    firstName: user.givenName,
    lastName: user.surname,
  };
}

export function isDaveoUser(user: MicrosoftUserDto): boolean {
  return (
    !EXCLUDED_GIVENNAMES.includes(user.givenName) &&
    !EXCLUDED_SURNAMES.includes(user.surname) &&
    user.givenName !== null &&
    user.surname !== null
  );
}
