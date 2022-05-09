import { UserInterface, UserRepo } from "./interface";
import { User } from "../../entity/User";
import { getRepository } from "typeorm";

class UserRepository implements UserRepo {
  private ormRepo;

  constructor() {
    this.ormRepo = getRepository(User);
  }

  createUser = async (user: UserInterface) => await this.ormRepo.save(user);
  retrieveUsers = async () => await this.ormRepo.find();
  profileUser = async (id: string) => await this.ormRepo.findOne({ id });
  updateUser = async (id: string, userData: UserInterface) =>
    await this.ormRepo.update({ id }, userData);
  deleteUser = async (id: string) => await this.ormRepo.delete({ id });
}

export default UserRepository;
