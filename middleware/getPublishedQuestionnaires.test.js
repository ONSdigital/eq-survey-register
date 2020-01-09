const { getPublishedQuestionnaires } = require("./index");

describe("Getting a list of published questionnaires", () => {
  let mockRequest, mockResponse, model;

  beforeEach(() => {
    mockRequest = data => {
      return {
        body: data
      };
    };

    mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    model = {
      scan: jest.fn(() => model),
      beginsWith: jest.fn(() => model),
      exec: jest.fn(callback =>
        callback(null, [
          {
            registry_id: "783f6879-be44-48ff-a345-630bcc7b892a",
            eq_id: "d1f48f53-b223-4fe9-b4bd-da19d2c835bf",
            survey_id: "googlepixel4",
            form_type: "123",
            title: "Google Pixel 4",
            lastPublished: "2020-01-09T13:20:17.770Z",
            survey_version: "3"
          }
        ])
      )
    };
  });

  it("should return a 401 if the body data is not set", () => {
    const req = mockRequest();
    const res = mockResponse();

    model.exec = jest.fn(callback => callback(null, null));

    getPublishedQuestionnaires(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return status 404 if questionnaire cannot be found", () => {
    const req = mockRequest({
      survey_id: "googlepixel4",
      form_type: "123"
    });
    const res = mockResponse();
    model.exec = jest.fn(callback => callback(null, null));

    getPublishedQuestionnaires(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(404);

    model.exec = jest.fn(callback => callback(null, []));

    getPublishedQuestionnaires(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return status 200 if questionnaire can be found", () => {
    const req = mockRequest({
      survey_id: "googlepixel4",
      form_type: "123"
    });
    const res = mockResponse();

    getPublishedQuestionnaires(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return status 500 if a database error occurs", () => {
    const req = mockRequest({
      survey_id: "googlepixel4",
      form_type: "123"
    });
    const res = mockResponse();

    model.exec = jest.fn(callback => callback(true, null));

    getPublishedQuestionnaires(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
