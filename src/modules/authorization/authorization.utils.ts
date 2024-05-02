import { MsUser } from '../microsoft/types/microsoft.types';
import { FirestoreDocumentType } from '../shared/types/Firestore.types';
import { defaultAuthorization } from './constants';
import { UserDto } from './dto/authorization.dto';

export function formatAuthorizedUser(gUser: MsUser, authUser: FirestoreDocumentType): UserDto {
  return {
    _id: gUser._id,
    firstName: gUser.firstName,
    lastName: gUser.lastName,
    email: gUser.email,
    ...defaultAuthorization,
    ...authUser,
  };
}
