const databases = ["dynamo", "firestore"]

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

const mockRequest = () => {
    req = {params:{}};
    return req;
}

const mockModel = () => {
    const model = {
        id: "12345",
        eq_id: "678",
        survey_id: "001",
        form_type: "ONS",
        date_published: Date.now(),
        survey_version: "1",
        survey: {eq_id:"456", test:"test123"}
      }
    return model;
}

describe.each(databases)("testing get from registry" ,(databaseName) => {

    let res, req, getSurveyFromRegistry, database, next = jest.fn();

    beforeAll ( async () => {
        jest.resetModules();
        process.env.DATABASE = databaseName;
        getSurveyFromRegistry = require("./getSurveyFromRegistry");
        database = require("../database");
        await database.saveModel(mockModel());
    });

    it(`should get a record from the registry using ${databaseName}`, async () => {
        res = mockResponse();
        req = mockRequest();
        req.params.id = "12345";
        await getSurveyFromRegistry(req, res, next); 
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json.mock.calls[0][0].eq_id).toBe("678");
    });

    it(`should return 500 and message when not record not found using ${databaseName}`, async () => {
        res = mockResponse();
        req = mockRequest();
        req.params.id = "1234";
        await getSurveyFromRegistry(req, res, next); 
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "No record found"});
    });
});
