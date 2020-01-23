const {Firestore} = require('@google-cloud/firestore');

let db;
if (process.env.NODE_ENV.toUpperCase() == "DEVELOPMENT"){
  db = new Firestore({
    projectId: process.env.FIRESTORE_PROJECT_ID
    //keyFilename: '../test_firestore_account.json'
  })
}
else{
  db = new Firestore();
}

const getQuestionnaire = async (params) => {
  let hash, sortKey, schema, response;

  if(!params.id && (!params.survey_id || !params.form_type)){
    throw "id or survey_id and form_type not provided in request";
  }

  if(params.id){
    hash = `${params.id}`;
  }
  else{
    hash = `${params.survey_id}_${params.form_type}_${params.language || "en"}`;
  }
  sortKey = `${params.version || "0"}`

  try{
    const docRef = await db.collection('schemas').doc(hash).collection('versions').doc(sortKey);
    schema = await docRef.get();
    if (!schema.exists){
      return;
    }
    response = await schema.data()
    return response;
  }
  catch(e){
    console.log(e)
    throw ("error getting record")
  }
}

const saveQuestionnaire = async (data) => {
  data.id = `${data.survey_id}_${data.form_type}_${data.language}`;
  data.sort_key = `0`;
  let currentModel;
  let docRef = await db.collection('schemas').doc(data.id).collection('versions').doc(data.sort_key)
  try{
    currentModel = await docRef.get();
    if(currentModel.exists){
      data.registry_version = (parseInt(currentModel.get('registry_version')) + 1).toString();
    }
    else {
      data.registry_version = "1";  
    }
    await docRef.set(data);
    data.sort_key = `${data.registry_version}`;
    docRef = await db.collection('schemas').doc(data.id).collection('versions').doc(data.sort_key);
    await docRef.set(data);
  }
  catch(e){
    console.log(e)
    throw("error saving record")
  } 
  return;
};

const getQuestionnaireSummary  = async ( latest ) => {
  const attributes = ["id", "sort_key", "survey_id", "form_type", "registry_version", "title", "language"];

  let result, colRef, sortOp, response = [];
  latest ? sortOp = "==" : sortOp = ">"
  try{
    colRef = await db.collectionGroup('versions').where('sort_key', sortOp, '0').select(...attributes);
    result = await colRef.get();
  }
  catch(e){
    throw("error getting summary");
  }

  result.forEach((doc) => {
    response.push(doc.data());
  });
  
  return response 

}

module.exports = {saveQuestionnaire, getQuestionnaire, getQuestionnaireSummary};
