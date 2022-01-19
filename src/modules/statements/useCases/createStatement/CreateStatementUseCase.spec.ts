
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";



let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  })

  it("should be able to create a new Statement", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "4Guilherme",
      email: "4gcg@gcg.com",
      password: "4gcg123"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: 'teste'
    })
    expect(statement).toHaveProperty("id");
  })

  it("should not be able to create a Statement because user not found", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "Error",
        type: OperationType.DEPOSIT,
        amount: 20,
        description: 'teste'
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("should not be able to withdraw", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "5Guilherme",
      email: "5gcg@gcg.com",
      password: "5gcg123"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: 'teste'
    })

    await expect(
      createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 2000,
      description: 'teste'
    })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  })

})
