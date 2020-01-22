const databases = ["dynamo"]

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

const mockRequest = () => {
    req = {
        params:{},
        query:{},
        body:{
            survey_id: "001",
            form_type: "ONS",
            language: "en",}
    };
    return req;
}

const mockModel = () => {
    const model = {
        author_id: "678",
        survey_id: "001",
        form_type: "ONS",
        date_published: Date.now(),
        survey_version: "1",
        schema: {eq_id:"456", test:"test123"},
        title: "A test",
        language: "en",
        runner_version: "v2"
      }
    return model;
}

describe.each(databases)("testing get from registry" ,(databaseName) => {

    let res, req, getQuestionnaireFromRegistry, database, next = jest.fn();

    beforeAll ( async () => {
        jest.resetModules();
        process.env.DATABASE = databaseName;
        getQuestionnaireFromRegistry = require("./getQuestionnaireFromRegistry");
        database = require("../database");
        await database.saveQuestionnaire(mockModel());
    });

    it(`should get the latest record from the registry using ${databaseName}`, async () => {
        res = mockResponse();
        req = mockRequest();
        await getQuestionnaireFromRegistry(req, res, next); 
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toBeCalledWith(expect.objectContaining({author_id:"678", sort_key:"v0_"}));
    });

    it(`should get a specific version from the registry using ${databaseName}`, async () => {
        res = mockResponse();
        req = mockRequest();
        req.body.version = "1";
        await getQuestionnaireFromRegistry(req, res, next); 
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toBeCalledWith(expect.objectContaining({author_id:"678", sort_key:"v1_"}));
    });

    it(`should return 500 and message when not record not found using ${databaseName}`, async () => {
        res = mockResponse();
        req = mockRequest();
        req.body.survey_id = "abc";
        await getQuestionnaireFromRegistry(req, res, next); 
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "No record found"});
    });
});
