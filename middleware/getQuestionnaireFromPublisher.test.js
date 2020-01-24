const mockSchema = require("./mocks/mockSchema")
const getQuestionnaireFromPublisher = require("./getQuestionnaireFromPublisher")
const request = require("request-promise-native")

const mockResponse = () => {
  const res = { questionnaire: {} }
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
      form_type: "ONS",
      language: "en"
    }
  }
  return req
}

jest.mock('request')

describe("testing getQuestionnaireFromPublisher", () => {
  let res, req
  const next = jest.fn()

  it(`should get the return a schema from the registry`, async () => {
    res = mockResponse()
    req = mockRequest()
    request.mockResolvedValue(mockSchema())
    await getQuestionnaireFromPublisher(req, res, next)
    expect(res.questionnaire).toMatchObject(mockSchema())
  })
})
