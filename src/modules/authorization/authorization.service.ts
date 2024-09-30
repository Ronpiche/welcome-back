import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FilterType, UserRoles } from "./types/authorization.types";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { RoleDto, UserDto } from "./dto/authorization.dto";
import { FieldValue } from "@google-cloud/firestore";
import { CreateUpdateRoleDto } from "./dto/create-role.dto";
import { User } from "./entities/User.entity";
import { Role } from "./entities/Role.entity";

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly logger: Logger,
  ) {}

  async getAllRoles(filter: FilterType): Promise<Role[]> {
    try {
      const roles = await this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.ROLES, filter);

      return roles as Role[];
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Error fetching roles: ${error.message}`);
    }
  }

  async getRoleById(roleId: string): Promise<Role> {
    try {
      const role = await this.firestoreService.getDocument(FIRESTORE_COLLECTIONS.ROLES, roleId);

      return role as Role;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createRole(payload: CreateUpdateRoleDto) {
    try {
      const now = FieldValue.serverTimestamp();
      const dataToSave = { ...payload, createdAt: now, updatedAt: now };

      return await this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.ROLES, dataToSave);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateRole(id: string, roleDto: RoleDto) {
    try {
      const now = FieldValue.serverTimestamp();
      const dataToUpdate = { ...roleDto, updatedAt: now };

      return await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.ROLES, id, dataToUpdate);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteRole(id: string): Promise<void> {
    try {
      const role = await this.firestoreService.getDocument(FIRESTORE_COLLECTIONS.ROLES, id);

      if (!role) {
        throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
      }

      await this.updateUsersWithRole(role as RoleDto);
      await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.ROLES, id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async updateUsersWithRole(role: RoleDto): Promise<void> {
    try {
      const updateQuery = { [role.app]: role.name };
      const updateData = { [role.app]: UserRoles.Collaborateur };

      await this.firestoreService.updateManyDocuments(FIRESTORE_COLLECTIONS.AUTHORIZED_USERS, updateQuery, updateData);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const authUsers = await this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.AUTHORIZED_USERS);

      const users = authUsers;

      return users as User[];
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const authUser = await this.firestoreService.getDocument(FIRESTORE_COLLECTIONS.AUTHORIZED_USERS, id);

      return authUser as User;
    } catch (error) {
      this.logger.error(error);
      throw new Error(`User not found: ${error.message}`);
    }
  }

  async updateUser(id: string, data: UserDto): Promise<void> {
    try {
      const now = FieldValue.serverTimestamp();
      const dataToUpdate = { ...data, updatedAt: now };

      await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.AUTHORIZED_USERS, id, dataToUpdate);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}