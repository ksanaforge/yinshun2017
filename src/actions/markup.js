const SET_MARKUPS="SET_MARKUPS";
const WRONG_CORPUS="WRONG_CORPUS";
const {openCorpus}=require("ksana-corpus");
const {loadMarkup}=require("../unit/markup");
const loadExternalMarkup=function(meta,json,corpus){
	return (dispatch,getState)=>{
		corpus=corpus||getState().activeCorpus;
		const cor=openCorpus(corpus);
		if (!cor)return {type:WRONG_CORPUS,corpus};

		const fields=loadMarkup(cor,json);
		dispatch({type:SET_MARKUPS,corpus, fields, meta});
	}
}
module.exports={loadExternalMarkup,SET_MARKUPS};