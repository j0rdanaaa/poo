import { User } from "../models/User";
import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UsersDatabase extends BaseDatabase {
  public static TABLE_USER: string = "users";

  public async getUsers(): Promise<UserDB[]> {

    const results: UserDB[] = await BaseDatabase.connection(
      UsersDatabase.TABLE_USER
    );

    return results;
  }

  public async findUserById(id: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseDatabase.connection(
      UsersDatabase.TABLE_USER
    ).where({ id });

    return userDB;
  }

  public async insertUser(newUserDB: UserDB) {
    await BaseDatabase
        .connection(UsersDatabase.TABLE_USER)
        .insert(newUserDB)
}

  public async updateUserById(id:string, newUser:UserDB) {
    await BaseDatabase
            .connection(UsersDatabase.TABLE_USER)
            .update( newUser )
            .where({id})
  }

  public async deleteUserById(id: string):Promise<void> {
    await BaseDatabase.connection(UsersDatabase.TABLE_USER).where({id}).del()

}

}