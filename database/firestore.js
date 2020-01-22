const {Firestore} = require('@google-cloud/firestore');

const db = new Firestore();

const getQuestionnaire = async (params) => {
  let hash, sortKey, schema;

  if(!params.id && (!params.survey_id || !params.form_type)){
    throw "id or survey_id and form_type not provided in request";
  }
  if(params.id){
    hash = `${params.id}`;
  }
  else{
    hash = `${params.survey_id}_${params.form_type}_${params.language || "en"}`;
  }
  sortKey = `v${params.version || "0"}_`

  schema = await db.collection('schemas').doc(hash).collection('versions').doc(sortKey).get();
  return schema.data();

}

const saveQuestionnaire = async (data) => {
  data.id = `${data.survey_id}_${data.form_type}_${data.language}`;
  data.sort_key = `v0_`;
  let currentModel;
  let docRef = await db.collection('schemas').doc(data.id).collection('versions').doc(data.sort_key)
  try{
    currentModel = await docRef.get();
  }
  catch(e){
    console.log(e);
    return false;
  }
  if(currentModel.exists){
    data.registry_version = (parseInt(currentModel.get('registry_version')) + 1).toString();
  }
  else {
    data.registry_version = "1";  
  }

  try{
    await docRef.set(data);
  }
  catch(e){
      console.log(e);
      return false;
  }
  data.sort_key = `v${data.registry_version}_`;
  docRef = await db.collection('schemas').doc(data.id).collection('versions').doc(data.sort_key)
  try{
    await docRef.set(data);
  }
  catch(e){
      console.log(e);
      return false;
  } 
  return true
};

const getQuestionnaireSummary  = async ( latest ) => {
  const attributes = ["id", "sort_key", "survey_id", "form_type", "registry_version", "title", "language"];

  let result, colRef, response = [];
  if(latest){
    colRef = await db.collectionGroup('versions').where('sort_key', '==', 'v0_').select(...attributes);
    result = await colRef.get();
  }
  else{
    colRef = await db.collectionGroup('versions').where('sort_key', '==', 'v1_').select(...attributes);
    result = await colRef.get();
  }

  result.forEach((doc) => {
    response.push(doc.data());
  });
  
  return response 

}

module.exports = {saveQuestionnaire, getQuestionnaire, getQuestionnaireSummary};
