const databases = ["dynamo", "firestore"]

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mockRequest = () => {
  const req = {
    params: {},
    query: {},
    body: {
      survey_id: "001",
      form_type: "456",
      language: "en"
    }
  }
  return req
}

const mockModel = () => {
  const model = {
    author_id: "678",
    survey_id: "001",
    form_type: "456",
    date_published: Date.now(),
    survey_version: "1",
    schema: { eq_id: "456", test: "test123" },
    title: "A test",
    language: "en",
    runner_version: "v2"
  }
  return model
}

describe.each(databases)("testing getQuestionnaireSummary", (databaseName) => {
  let res, req, database, getQuestionnaireSummary
  const next = jest.fn()

  beforeAll(async () => {
    jest.resetModules()
    process.env.DATABASE = databaseName
    getQuestionnaireSummary = require("./getQuestionnaireSummary")
    database = require("../database")
    const mock = mockModel()
    await database.saveQuestionnaire(mock)
    mock.survey_id = '789'
    await database.saveQuestionnaire(mock)
  })

  it(`should return a list of the latest versions of questionnaires ${databaseName}`, async () => {
    res = mockResponse()
    req = mockRequest()
    req.latest = true
    await getQuestionnaireSummary(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toBeCalledWith(expect.arrayContaining([expect.objectContaining({ survey_id: "001", form_type: "456" })]))
    expect(res.json).toBeCalledWith(expect.arrayContaining([expect.objectContaining({ survey_id: "789", form_type: "456" })]))
    expect(res.json).toBeCalledWith(expect.arrayContaining([expect.objectContaining({ sort_key: "0" })]))
  })

  it(`should return a list of all versions of questionnaires excluding latest ${databaseName}`, async () => {
    res = mockResponse()
    req = mockRequest()
    req.latest = false
    await getQuestionnaireSummary(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toBeCalledWith(expect.arrayContaining([expect.objectContaining({ survey_id: "001", form_type: "456" })]))
    expect(res.json).toBeCalledWith(expect.arrayContaining([expect.objectContaining({ survey_id: "789", form_type: "456" })]))
    expect(res.json).toBeCalledWith(expect.arrayContaining([expect.not.objectContaining({ sort_key: "0" })]))
  })
})
