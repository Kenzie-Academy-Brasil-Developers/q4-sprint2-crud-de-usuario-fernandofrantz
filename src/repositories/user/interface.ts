interface UserInterface {
  id?: string;
  name: string;
  email: string;
  password: string;
  isAdm: boolean;
  createdOn: Date;
  updatedOn: Date;
}

interface UserRepo {
  createUser: (user: UserInterface) => Promise<UserInterface>;
  retrieveUsers: () => Promise<UserInterface[]>;
  profileUser: (id: string) => Promise<UserInterface>;
  updateUser: (id: string, userData: UserInterface) => Promise<UserInterface>;
  deleteUser: (id: string) => Promise<UserInterface>;
}

export { UserInterface, UserRepo };
