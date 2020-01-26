const databases = ["dynamo", "firestore"]
const mockSchema = require("./mocks/mockSchema")

const mockResponse = () => {
  const res = { questionnaire: mockSchema() }
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mockRequest = () => {
  return {
    body: {
      surveyId: "1",
      formTypes: { ONS: "123" },
      surveyVersion: "2"
    }
  }
}

const mockBadRequest = () => {
  return {
    body: {
      surveyId: "1"
    }
  }
}

describe.each(databases)("testing InsertIntoRegistry", (databaseName) => {
  let res, req, insertIntoRegistry
  const next = jest.fn()

  beforeAll(() => {
    jest.resetModules()
    process.env.DATABASE = databaseName
    insertIntoRegistry = require("./insertIntoRegistry")
  })

  it(`should add a record into the registry using ${databaseName}`, async () => {
    res = mockResponse()
    req = mockRequest()
    await insertIntoRegistry(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: "Ok" })
  })

  it(`should throw an error when sending a bad request using ${databaseName}`, async () => {
    res = mockResponse()
    req = mockBadRequest()
    await insertIntoRegistry(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: "Sorry, something went wrong inserting into the register" })
  })

})
