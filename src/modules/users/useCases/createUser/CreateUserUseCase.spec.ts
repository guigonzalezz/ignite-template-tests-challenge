import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";



let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase



describe("Create User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "8Guilherme",
      email: "8gcg@gcg.com",
      password: "8gcg123"
    })

    expect(user).toHaveProperty("id");
  })

  it("should not be able to create a user with exists", async () => {
    await createUserUseCase.execute({
      name: "8Guilherme",
      email: "8gcg@gcg.com",
      password: "8gcg123"
    })

    await expect(
      createUserUseCase.execute({
        name: "8Guilherme",
        email: "8gcg@gcg.com",
        password: "8gcg123"
      })
    ).rejects.toEqual(new CreateUserError());
  });

})
