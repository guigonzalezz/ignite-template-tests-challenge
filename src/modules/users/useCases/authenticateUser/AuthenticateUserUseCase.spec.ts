import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";



let usersRepositoryInMemory: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase


describe("Authenticate User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  })

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "6Guilherme",
      email: "6gcg@gcg.com",
      password: "6gcg123"
    }

    await usersRepositoryInMemory.create(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token");
  })

  it("should not be able to authenticate an nonexistent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "1234",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "7Guilherme",
      email: "7gcg@gcg.com",
      password: "7gcg123"
    })

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

})

