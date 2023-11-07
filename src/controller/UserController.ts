import { Request, Response } from "express";
import { UsersDatabase } from "../database/UserDatabase";
import { User } from "../models/User";
import { UserDB } from "../types";

export class UserController {
  public getUsers = async (req: Request, res: Response) => {
    try {
      const userDataBase = new UsersDatabase();
      const usersDB = await userDataBase.getUsers();

      const users: User[] = usersDB.map(
        (userDB) => new User(userDB.id, userDB.name, userDB.created_at)
      );

      res.status(200).send({ message: users });
    } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  };

  public postUser = async (req: Request, res: Response) => {
    try {
      const { id, name } = req.body;

      if (typeof id !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }

      if (typeof name !== "string") {
        res.status(400);
        throw new Error("'name' deve ser string");
      }

      const userDataBase = new UsersDatabase();
      const userDBExists = await userDataBase.findUserById(id);

      if (userDBExists) {
        res.status(400);
        throw new Error("'id' já existe");
      }

      const newUser = new User(id, name, new Date().toISOString()); // yyyy-mm-ddThh:mm:sssZ

      const newUserDB: UserDB = {
        id: newUser.getId(),
        name: newUser.getName(),
        created_at: newUser.getCreatedAt(),
      };

      await userDataBase.insertUser(newUserDB);

      res.status(201).send(newUser);
    } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  };

  public putUser = async (req:Request , res:Response) =>{
try {
    const idUser = req.params.id;
    const { id, name } = req.body;

    const userDataBase = new UsersDatabase();
    const userDBExists = await userDataBase.findUserById(idUser);

    if (!userDBExists) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    const user = new User(
      userDBExists.id,
      userDBExists.name,
      userDBExists.created_at
    );

    user.setId(id);
    user.setName(name);
    user.setCreatedAt(new Date().toISOString());


    const newUser:UserDB ={
        id: user.getId(),
        name: user.getName(),
        created_at: user.getCreatedAt(),
    } 




    await userDataBase.updateUserById(idUser, newUser);

    res.status(200).send({ message: user });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
  }

  public deleteUser = async (req:Request , res:Response) =>{
    try {
        const idToDelete = req.params.id

        if (typeof idToDelete !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        const userDataBase = new UsersDatabase();
        const userDBExists = await userDataBase.findUserById(idToDelete);

        if (!userDBExists) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        const user = new User(
            userDBExists.id,
            userDBExists.name,
            userDBExists.created_at
        )

        await userDataBase.deleteUserById(user.getId());

        res.status(200).send("Usuario deletado com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
  }
}