/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Jun 2018     ameka
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
   
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord(){

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Boolean} True to continue changing field value, false to abort value change
 */
function clientValidateField_invoice_type(type, name, linenum){
	if (name === 'custbody_inv_type')
	   {
	      var InvType = nlapiGetFieldValue('custbody_inv_type');
	      //alert('custbody_inv_type');

	      if (InvType == 2 || InvType == 4 || InvType == 5)
	      {
	    	  alert('Please enter Invoice Gross Loss field with new value AND'+'\n'+'Please enter Gross Loss value from Prior Estimate');
            
          }
       }
  return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged_settle_assist(type,name){
	if(name == 'custbody_was_settle_assist_used'){
		var customer =nlapiGetFieldValue('entity');
		//alert("Customer: " + customer);
		//nlapiLogExecution('DEBUG','customer',customer);
		var settle_assist_to_be_used = nlapiGetFieldValue('custbody_was_settle_assist_used');
		//nlapiLogExecution('DEBUG','checkbox',checkbox);
		
		
		if ((customer == 45 || customer == 22837) && settle_assist_to_be_used == 1 ){
			var confirm_line_item = confirm('Do you want to apply Settle Assist Discount?');
			if(confirm_line_item == true){
			nlapiSelectNewLineItem('item'); 
			var line_item = nlapiSetCurrentLineItemValue('item', 'item', 252);
			nlapiCommitLineItem('item');
			}
			
		}
	}
	return true;
}
	/*var filenam = nlapiGetFieldValue('custbody_sup_line_item');
	nlapiLogExecution('DEBUG','filenam',filenam);
	var customer =nlapiGetFieldValue('entity');
	nlapiLogExecution('DEBUG','customer',customer);
	var lineCount =nlapiGetLineItemCount('item');
	nlapiLogExecution('DEBUG','lineCount',lineCount);
	var index = lineCount+1;
	nlapiLogExecution('DEBUG','index',index);


	if (customer == 45 && checkbox == 'T' ){
	nlapiInsertLineItem(type, index )
	//nlapiSelectNewLineItem('item'); 
	var lin_item_name = nlapiSetCurrentLineItemValue('item', 'item', 253, true, true); 
	nlapiLogExecution('DEBUG','lin_item_name',lin_item_name);
	//nlapiSetCurrentLineItemValue('item', 'quantity', 2, true, true); 
	//nlapiSetCurrentLineItemValues('item', 'serialnumbers', serialArr, true, true); 
	nlapiCommitLineItem('item');
	}*/


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @returns {Void}
 */
function clientPostSourcing(type, name) {
	
   
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientRecalc(type){
 
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item insert, false to abort insert
 */
function clientValidateInsert(type){
  
    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item delete, false to abort delete
 */
function clientValidateDelete(type){
   
    return true;
}
