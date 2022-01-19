import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  })

  it("should be able to get the statement operation", async () => {
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

    const statementExist = await getStatementOperationUseCase.execute({ user_id: user.id, statement_id: statement.id })

    expect(statementExist).toBe(statement);
  })

  it("should not be able to get the statement operation because user not found", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "2Guilherme",
      email: "2gcg@gcg.com",
      password: "2gcg123"
    })

    const statement = await statementsRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: 'teste'
    })

    await expect(
      getStatementOperationUseCase.execute({ user_id: "Error", statement_id: statement.id })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able to get the statement operation because statement not found", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "1Guilherme",
      email: "1gcg@gcg.com",
      password: "1gcg123"
    })

    const statement = await statementsRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: 'teste'
    })

    await expect(
      getStatementOperationUseCase.execute({ user_id: user.id, statement_id: "Error" })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

})

