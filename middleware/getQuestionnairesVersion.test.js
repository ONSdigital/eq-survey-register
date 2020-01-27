const { getQuestionnairesVersion } = require("./index");

describe("Getting a version of a questionnaire", () => {
  let model;

  const mockRequest = data => ({ query: data });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    model = {
      queryOne: jest.fn(() => model),
      exec: jest.fn(callback =>
        callback(null, {
          eq_id: "d1f48f53-b223-4fe9-b4bd-da19d2c835bf",
          form_type: "123",
          mime_type: "application/json/ons/eq",
          schema_version: "0.0.1",
          data_version: "0.0.2",
          survey_id: "googlepixel4",
          title: "Google Pixel 4",
          sections: [],
          theme: "default",
          navigation: {},
          metadata: [],
          view_submitted_response: {}
        })
      )
    };
  });

  it("should return status 400 if query params are not set", async () => {
    const req = mockRequest({});
    const res = mockResponse();
    model.exec = jest.fn(callback => callback(null, null));

    await getQuestionnairesVersion(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return status 404 if questionnaire cannot be found", async () => {
    const req = mockRequest({
      survey_id: "googlepixel4",
      form_type: "123",
      survey_version: "1"
    });
    const res = mockResponse();
    model.exec = jest.fn(callback => callback(null, null));

    await getQuestionnairesVersion(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(404);

    model.exec = jest.fn(callback => callback(null, []));

    await getQuestionnairesVersion(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return status 200 if questionnaire can be found", async () => {
    const req = mockRequest({
      survey_id: "googlepixel4",
      form_type: "123",
      survey_version: "1"
    });
    const res = mockResponse();

    await getQuestionnairesVersion(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return status 500 if a database error occurs", async () => {
    const req = mockRequest({
      survey_id: "googlepixel4",
      form_type: "123",
      survey_version: "1"
    });
    const res = mockResponse();

    model.exec = jest.fn(callback => callback(true, null));

    await getQuestionnairesVersion(req, res, null, model);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
