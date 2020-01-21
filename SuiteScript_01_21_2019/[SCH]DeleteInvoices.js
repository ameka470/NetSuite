/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Nov 2018     ameka
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled1(type) {
	var invoiceSearch = nlapiSearchRecord("invoice",null,
			[
			   ["type","anyof","CustInvc"], 
			   "AND", 
			   ["mainline","is","T"], 
			   "AND", 
			   ["datecreated","on","11/14/2018 10:05 am"], 
			   "AND", 
			   ["systemnotes.context","anyof","CSV"],
			   "AND", 
			   ["payingtransaction","noneof","526053","526057"]
			], 
			[
			   new nlobjSearchColumn("datecreated"), 
			   new nlobjSearchColumn("trandate").setSort(false), 
			   new nlobjSearchColumn("type"), 
			   new nlobjSearchColumn("tranid"), 
			   new nlobjSearchColumn("entity"), 
			   new nlobjSearchColumn("account"), 
			   new nlobjSearchColumn("amount"),
			   new nlobjSearchColumn("internalid")
			]
			);
	 if(invoiceSearch)
	 {
		for(var i=0; i<invoiceSearch.length;i++)
		//for(var i=0; i<5;i++)
		{
			var invoiceId = invoiceSearch[i].getValue('internalid');
			nlapiDeleteRecord('invoice',invoiceId);
			//nlapiLogExecution('Debug','Record Deleted',invoiceId);
		}
		
	 }
}
