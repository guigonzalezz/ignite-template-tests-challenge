import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";




let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get balance", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory)
  })

  it("should be able to get the balance", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "3Guilherme",
      email: "3gcg@gcg.com",
      password: "3gcg123"
    })

    const statement = await statementsRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: 'teste'
    })

    const balance = await getBalanceUseCase.execute({ user_id: user.id })

    expect(balance).toHaveProperty("balance");
  })

  it("should not be able to get the balance because user not found", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "Error" })
    ).rejects.toEqual(new GetBalanceError());
  });

})
