/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Dec 2017     TG Mounika
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){
	try{
		var newItemArray=new Array();
		var lineCount=nlapiGetLineItemCount('item');
		nlapiLogExecution('DEBUG', 'lineCount'+ lineCount);
		for(var loop=1;loop<=lineCount;loop++){
			var checkboxValue = nlapiGetLineItemValue('item', 'custcol_259_billed', loop);
			nlapiLogExecution('DEBUG', 'checkboxValue'+ checkboxValue);
			if(checkboxValue == 'T'){
				nlapiLogExecution('DEBUG', 'loop'+ loop);
				//newItemArray.push(loop);
				//log.debug("newItemArray",newItemArray);	
				/*var quantityField = nlapiGetLineItemField('item', 'quantity', loop);
				nlapiLogExecution('DEBUG', 'quantityField'+ quantityField);
				*/
				//var checking=nlapiDisableLineItemField('item','quantity', 'T');
				 var itemDisFields = ['quantity'];
//nlapiSetLineItemDisabled('item','quantity','T',loop);    
				var checking= nlapiDisableLineItemField('item',itemDisFields[loop] , true); 
				nlapiLogExecution('DEBUG', 'checking'+ checking);
			}
		}
	}
	catch(error){
		nlapiLogExecution('DEBUG', 'error'+ error);
	}
}

