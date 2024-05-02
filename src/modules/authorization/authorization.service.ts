import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FirestoreService } from '../shared/firestore/firestore.service';
import { FilterType, UserRoles } from './types/authorization.types';
import { FIRESTORE_COLLECTIONS } from '../shared/firestore/constants';
import { RoleDto, UserDto } from './dto/authorization.dto';
import { MicrosoftService } from '../microsoft/microsoft.service';
import { FieldValue } from '@google-cloud/firestore';
import { CreateUpdateRoleDto } from './dto/create-role.dto';
import { formatAuthorizedUser } from './authorization.utils';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly microsoftService: MicrosoftService,
    private readonly logger: Logger,
  ) {}

  async getAllRoles(filter: FilterType): Promise<CreateUpdateRoleDto[]> {
    try {
      const roles = await this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.roles, filter);

      return roles as CreateUpdateRoleDto[];
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Error fetching roles: ${error.message}`);
    }
  }

  async getRoleById(roleId: string): Promise<unknown> {
    try {
      const role = await this.firestoreService.getDocument(FIRESTORE_COLLECTIONS.roles, roleId);
      return role;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createRole(payload: CreateUpdateRoleDto) {
    try {
      const now = FieldValue.serverTimestamp();
      const dataToSave = { ...payload, createdAt: now, updatedAt: now };

      return await this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.roles, dataToSave);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateRole(id: string, roleDto: RoleDto) {
    try {
      const now = FieldValue.serverTimestamp();
      const dataToUpdate = { ...roleDto, updatedAt: now };

      return await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.roles, id, dataToUpdate);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteRole(id: string): Promise<void> {
    try {
      const role = await this.firestoreService.getDocument(FIRESTORE_COLLECTIONS.roles, id);

      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }

      await this.updateUsersWithRole(role as RoleDto);
      await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.roles, id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async updateUsersWithRole(role: RoleDto): Promise<void> {
    try {
      const updateQuery = { [role.app]: role.name };
      const updateData = { [role.app]: UserRoles.Collaborateur };

      await this.firestoreService.updateManyDocuments(FIRESTORE_COLLECTIONS.authorizedUsers, updateQuery, updateData);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllUsers(): Promise<UserDto[]> {
    try {
      const gUsers = await this.microsoftService.getUsers();
      const authUsers = await this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.authorizedUsers);

      const users = gUsers.map((gUser) => {
        const authUser = authUsers.find((authUser: UserDto) => authUser._id === gUser._id);
        return formatAuthorizedUser(gUser, authUser);
      });

      return users as UserDto[];
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async getUserById(id: string): Promise<UserDto> {
    try {
      const gUser = await this.microsoftService.getUserById(id);
      const authUser = await this.firestoreService.getDocument(FIRESTORE_COLLECTIONS.authorizedUsers, id);

      return formatAuthorizedUser(gUser, authUser);
    } catch (error) {
      this.logger.error(error);
      throw new Error(`User not found: ${error.message}`);
    }
  }

  async updateUser(id: string, data: UserDto): Promise<void> {
    try {
      const now = FieldValue.serverTimestamp();
      const dataToUpdate = { ...data, updatedAt: now };

      return await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.authorizedUsers, id, dataToUpdate);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
