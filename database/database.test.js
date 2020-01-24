const databases = ["dynamo", "firestore"]

const mockModel = () => {
  return {
    author_id: "123",
    survey_id: "123",
    form_type: "456",
    survey_version: "1",
    schema: JSON.stringify({ eq_id: "123", version: "1", title: "test" }),
    title: "test",
    language: "en",
    runner_version: "v1"
  }
}
const mockRequest = () => {
  return {
    survey_id: "123",
    language: "en",
    form_type: "456"
  }
}

describe.each(databases)("testing database modules", (databaseName) => {
  let model, req, database, data

  beforeAll(async () => {
    jest.resetModules()
    process.env.DATABASE = databaseName
    database = require(".")
    model = mockModel()
    req = mockRequest()
    await database.saveQuestionnaire(model)
    model.schema = JSON.stringify({ eq_id: "123", version: "2", title: "test" })
    await database.saveQuestionnaire(model)
  })

  it(`should save a schema into the database using ${databaseName}`, async () => {
    expect(async () => {
      await database.saveQuestionnaire(model)
    }).not.toThrow()
  })

  it(`should retrieve the latest version using ${databaseName}`, async () => {
    data = await database.getQuestionnaire(req)
    expect(data).toMatchObject({ eq_id: "123", title: "test" })
    expect(data).toMatchObject({ version: "2" })
  })

  it(`should retrieve a specific version using ${databaseName}`, async () => {
    req.version = "1"
    data = await database.getQuestionnaire(req)
    expect(data).toMatchObject({ eq_id: "123", title: "test" })
    expect(data).toMatchObject({ version: "1" })
  })

  it(`should retieve a list of latest schema version using ${databaseName}`, async () => {
    data = await database.getQuestionnaireSummary(true)
    expect(data).toEqual(expect.arrayContaining([expect.objectContaining({ sort_key: "0" })]))
    expect(data).toEqual(expect.not.arrayContaining([expect.objectContaining({ sort_key: "1" })]))
  })

  it(`should retieve a list of all schema version using ${databaseName}`, async () => {
    data = await database.getQuestionnaireSummary(false)
    expect(data).toEqual(expect.arrayContaining([expect.objectContaining({ sort_key: "1" })]))
    expect(data).toEqual(expect.not.arrayContaining([expect.objectContaining({ sort_key: "0" })]))
  })
})
