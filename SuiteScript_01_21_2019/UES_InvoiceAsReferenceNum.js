/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 May 2018     Anusha PC
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
function userEventBeforeSubmit(type){
 
		if(type=='create' || type == 'edit' )
		{
			nlapiLogExecution('Debug', 'type=',type);
			var i_createdFrom = nlapiGetFieldValue('custbody_sxrd__created_from');
			var dateCreated = nlapiGetFieldValue('trandate');
			dateCreated = nlapiStringToDate(dateCreated);
			nlapiLogExecution('Debug', 'i_createdFrom=',i_createdFrom);
			if(i_createdFrom)
				{
				var invoiceSearch = nlapiSearchRecord("invoice",null,
						[
						   ["type","anyof","CustInvc"], 
						   "AND", 
						   ["createdfrom","anyof",i_createdFrom], 
						   "AND", 
						   ["mainline","is","T"],
						   "AND", 
						   ["datecreated","on",dateCreated]
						], 
						[
				 
						   new nlobjSearchColumn("tranid"),
						   new nlobjSearchColumn("createdfrom").setSort(true)
						]
						);
				if(invoiceSearch)
					{
						nlapiLogExecution('Debug', 'i_createinvoiceSearchdFrom=',invoiceSearch.length);
						var i_invoiceNo = invoiceSearch[0].getValue('tranid');
						nlapiLogExecution('Debug', 'i_invoiceNo=',i_invoiceNo);
					}
					 
					 if(i_invoiceNo)
					 {
						 nlapiSetFieldValue('tranid',i_invoiceNo);
					 }
				}
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
function userEventAfterSubmit(type){
	
  
}