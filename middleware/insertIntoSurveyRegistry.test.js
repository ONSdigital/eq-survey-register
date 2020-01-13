const { insertIntoSurveyRegistry } = require("./index");

describe("Inserting a questionnaire into the registry", () => {
  let mockRequest, mockResponse, Model;

  beforeEach(() => {
    mockRequest = data => {
      return {
        body: data
      };
    };

    mockResponse = data => {
      const res = data ? data : {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    Model = class {
      constructor(data) {
        this.data = data;
      }

      static queryOne(data) {
        return this;
      }
      static save() {
        return this;
      }
      static update() {
        return this;
      }
      static exec(callback) {
        return callback(null, {
          register_id: "123-546-789",
          sort_key: "v0_abc_def",
          author_id: "456-789-123",
          eq_id: "789-123-456",
          survey_id: "abc",
          form_type: "def",
          survey_version: "1",
          runner_version: "1",
          language: "en",
          title: "ABC; it's easy as 1, 2, 3...",
          schema: "0.0.2"
        });
      }
    };
  });

  it("should return status 401 if body data is not set", async () => {
    const req = mockRequest();
    const res = mockResponse({ questionnaire: {} });

    await insertIntoSurveyRegistry(req, res, null, Model);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return status 401 if response questionnaire is not set", async () => {
    const req = mockRequest({ formTypes: [] });
    const res = mockResponse();

    await insertIntoSurveyRegistry(req, res, null, Model);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return status 200 if it creates a new entry successfully", async () => {
    const req = mockRequest({
      formTypes: [{ ONS: "def" }],
      questionnaireId: "789-123-456",
      surveyVersion: "1"
    });
    const res = mockResponse({
      questionnaire: {
        eq_id: "789-123-456",
        survey_id: "abc",
        form_type: "def",
        data_version: "0.0.1",
        title: "ABC; it's easy as 1, 2, 3..."
      }
    });

    await insertIntoSurveyRegistry(req, res, null, Model);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
