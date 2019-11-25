const { getQuestionnairesPublished } = require("./index");

describe("Getting a list of published questionnaires", () => {
  let model;

  const mockRequest = data => {
    return {
      body: data
    };
  };

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
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

  it("should return status 404 if questionnaire cannot be found", async () => {
    const req = mockRequest();
    const res = mockResponse();
    model.exec = jest.fn(callback => callback(null, null));

    await getQuestionnairesPublished(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(404);

    model.exec = jest.fn(callback => callback(null, []));

    await getQuestionnairesPublished(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return status 200 if questionnaire can be found", async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getQuestionnairesPublished(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return status 500 if a database error occurs", async () => {
    const req = mockRequest();
    const res = mockResponse();

    model.exec = jest.fn(callback => callback(true, null));

    await getQuestionnairesPublished(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
