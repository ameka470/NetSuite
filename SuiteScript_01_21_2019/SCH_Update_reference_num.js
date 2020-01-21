/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 May 2018     Anusha PC
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
			
	var savedSearch = nlapiLoadSearch('vendorbill', 'customsearch211');
	var resultset = savedSearch.runSearch();
	var returnSearchResults = [];
	var searchid = 0;
	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for ( var rs in resultslice) {
			returnSearchResults.push(resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	//return returnSearchResults;		
			
	nlapiLogExecution('debug','returnSearchResults',returnSearchResults.length);
	if(returnSearchResults)
		{
		for(var i=0; i< returnSearchResults.length; i++)
			{
			var BillNo = returnSearchResults[i].getValue('internalid');
			nlapiLogExecution('Debug','BillNo',BillNo);
			var i_createdFrom = returnSearchResults[i].getValue('custbody_sxrd__created_from');
			nlapiLogExecution('Debug','i_createdFrom',i_createdFrom);
			var dateCreated =  returnSearchResults[i].getValue('datecreated');
			dateCreated = nlapiStringToDate(dateCreated);
			nlapiLogExecution('Debug','dateCreated'+dateCreated,'i_createdFrom'+i_createdFrom);
				if(_logValidation(i_createdFrom)&&_logValidation(dateCreated))
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
					 //nlapiLogExecution('Debug', 'i_createinvoiceSearchdFrom=',invoiceSearch.length);
					 var i_invoiceNo = invoiceSearch[0].getValue('tranid');
					 nlapiLogExecution('Debug', 'i_invoiceNo=',i_invoiceNo);
					 if(i_invoiceNo)
					 nlapiSubmitField('vendorbill', BillNo, 'tranid',i_invoiceNo);
					}
				}
				var context = nlapiGetContext();
				if(context.getRemainingUsage() < 200)
				 {
				  var state = nlapiYieldScript();
				 }
			}
		}
	//var i_createdFrom = nlapiGetFieldValue('custbody_sxrd__created_from');
	//nlapiLogExecution('Debug', 'i_createdFrom=',i_createdFrom);
		

}

function _logValidation(value) 
{
 if(value != null && value.toString() != null && value != '' && value != undefined && value.toString() != undefined && value != 'undefined' && value.toString() != 'undefined'&& value.toString() != 'NaN' && value != NaN) 
 {
  return true;
 }
 else 
 { 
  return false;
 }
}
