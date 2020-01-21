/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Jul 2018     ameka
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function userEventBeforeLoad(type, form, request){
	
 
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function externalid(type){
	//var myRecord = nlapiLoadRecord('salesorder', internal id);  //where recordType and recordID are the Type and Internal ID of the Record being loaded
	//myRecord.setFieldValue('externalid', 'custbody_sxrd_cms_no'); //where desiredValueOfExternalID is the new value of the External ID
	//
	//nlapiSubmitRecord(myRecord);
// var ext = nlapiGetFieldValue('custbody_sxrd_cms_no');
 //if(ext){
	 //nlapiSetFieldValue('externalid',ext);
 //}
  if(type == 'create') {
     
	var salesOrder = nlapiLoadRecord('salesorder',nlapiGetRecordId());
  nlapiLogExecution('Debug','salesOrder',salesOrder);
  var customer = nlapiGetFieldValue('entity');
  
  if( customer != 72 && customer !=21782){
    nlapiLogExecution('Debug','customer',customer);
	var externalId = nlapiGetFieldValue('custbody_sxrd_cms_no');
       nlapiLogExecution('Debug','externalId',externalId);
    
	if(externalId){
		salesOrder.setFieldValue('externalid',externalId);
      
		nlapiSubmitRecord(salesOrder);
      
    }
      
    }//else{
      
      //alert('Please enter unique CMS No');
    //}
  }
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */

