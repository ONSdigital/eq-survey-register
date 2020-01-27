const mockSchema = require("./mocks/mockSchema")
jest.mock('request')
const request = require("request-promise-native")
const getQuestionnaireFromPublisher = require("./getQuestionnaireFromPublisher")

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

  it(`should handle a thrown error`, async () => {
    res = mockResponse()
    req = mockRequest()
    request.mockImplementation(async () => {
      throw new Error("test error")
    })
    await getQuestionnaireFromPublisher(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
