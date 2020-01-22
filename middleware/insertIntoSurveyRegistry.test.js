const databases = ["dynamo", "firestore"]

const mockResponse = () => {
    const res = {questionnaire:{eq_id:"456", title:"test123"}};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

const mockRequest = () => {
    return { 
        body:{
            surveyId:"1", 
            formTypes:{"ONS":"123"},
            surveyVersion:"2",
        }
    };
}

describe.each(databases)("testing InsertIntoSurveyRegistry" ,(databaseName) => {
    let res, req, next = jest.fn(), insertIntoSurveyRegistry;

    beforeAll (() => {
        jest.resetModules();
        process.env.DATABASE = databaseName;
        insertIntoSurveyRegistry = require("./insertIntoSurveyRegistry");
    });
    
    it(`should add a record into the registry using ${databaseName}`, async () => {
        res = mockResponse();
        req = mockRequest();
        await insertIntoSurveyRegistry(req, res, next); 
        expect(res.status).toHaveBeenCalledWith(200);   
        expect(res.json).toHaveBeenCalledWith({ message: "Ok" });
    });
});