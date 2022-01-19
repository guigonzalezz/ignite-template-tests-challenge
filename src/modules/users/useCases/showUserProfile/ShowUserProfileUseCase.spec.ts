import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



let usersRepositoryInMemory: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase



describe("Show User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
  })

  it("should be able to find a user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "10Guilherme",
      email: "10gcg@gcg.com",
      password: "10gcg123"
    })

    const userExist = await showUserProfileUseCase.execute(user.id)
    expect(user).toEqual(userExist);
  })

  it("should not be able to find an user", async () => {
    await expect(
      showUserProfileUseCase.execute("Error")
    ).rejects.toEqual(new ShowUserProfileError());
  });

})
