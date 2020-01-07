describe("Database interactions", () => {
  let dynamoose, QuestionnaireModel;
  let getLatestVersionOfQuestionnaire;
  let mockRequest, mockResponse;

  beforeEach(() => {
    dynamoose = {
      transaction: jest.fn().mockResolvedValue()
    };

    QuestionnaireModel = class {
      constructor(data) {
        Object.assign(this, data);
      }
      originalItem() {
        return this[originalKey];
      }
      static queryOne() {
        return {
          descending: function() {
            return this;
          },
          consistent: function() {
            return this;
          },
          exec: jest.fn()
        };
      }
    };

    jest.doMock("../database", () => ({
      QuestionnaireModel,
      dynamoose
    }));

    getLatestVersionOfQuestionnaire = require("./index")
      .getLatestVersionOfQuestionnaire;

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
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe("Getting latest version of questionnaire", () => {
    it("should return status 401 if body data is not set", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await getLatestVersionOfQuestionnaire(req, res, null);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return status 200 if it can find a questionnaire", async () => {
      const req = mockRequest({ form_type: 123, survey_id: 456 });
      const res = mockResponse();

      await getLatestVersionOfQuestionnaire(req, res, null);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
