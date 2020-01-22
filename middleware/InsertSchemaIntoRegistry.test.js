const databases = ["dynamo", "firestore"]

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

const mockSchema = () => {
    const schema = {
        eq_id:"456", 
        test:"test123",
        title:"A Test",
      }
    return schema;
}

const mockRequest = () => {
    return { 
        body:{
            survey_id: "123", 
            form_types:"O456",
            survey_version:"2",
            theme: "ONS",
            language: "en",
            schema: mockSchema()
        }
    }
}

describe.each(databases)("testing InsertIntoSurveyRegistry" ,(databaseName) => {
    let res, req, next = jest.fn(), insertIntoSurveyRegistry;

    beforeAll (() => {
        jest.resetModules();
        process.env.DATABASE = databaseName;
        insertSchemaIntoRegistry = require("./insertSchemaIntoRegistry");
    });
    
    it(`should add a record into the registry using ${databaseName}`, async () => {
        res = mockResponse();
        req = mockRequest();
        await insertSchemaIntoRegistry(req, res, next); 
        expect(res.status).toHaveBeenCalledWith(200);   
        expect(res.json).toHaveBeenCalledWith({ message: "Ok" });
    });
});