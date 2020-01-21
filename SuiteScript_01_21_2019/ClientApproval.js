/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 May 2018     ameka
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

function send_approval_status()
{
	
	var CarriarName = nlapiGetFieldValue('custpage_invnum2');
	//alert('CarriarName = '+CarriarName);
	var policyNumber = nlapiGetFieldValue('custpage_invnum3');
	//alert('Claim Number ='+claimNumber);
	var claimNumber = nlapiGetFieldValue('custpage_invnum4');
	//alert('Claim Number ='+claimNumber);
	var adjusterName = nlapiGetFieldValue('custpage_invnum5');
	//alert('Adjuster Name='+adjusterName)
	
	var requestedBy = nlapiGetFieldValue('custpage_invnum7');
	//alert('requestedBy='+requestedBy);
	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    today = mm+'/'+dd+'/'+yyyy; 
    
    var date1 = nlapiGetFieldValue('date');
	var i_suervisor = nlapiGetFieldValue('custpage_supervisor');
	var record = nlapiCreateRecord('customrecord283');
	
	//record.setFieldValue('name','Invoice Adjustment');
	
	record.setFieldValue('custrecord77',CarriarName); // Carrier name
	record.setFieldValue('custrecord_claimnumber',claimNumber);
	record.setFieldValue('custrecord79',policyNumber);
	record.setFieldValue('custrecord78',adjusterName); // Adjuster name
	//record.setFieldValue('custrecord_reason',reason);
	record.setFieldValue('custrecord_requestedby',requestedBy);
	record.setFieldValue('custrecord80',date1);
	//record.setFieldValue('custrecord_requested_by',requestedBy);// requested by
	record.setFieldValue('custrecord82',i_suervisor);
	record.setFieldValue('custrecord81',1);// approval status
	//record.setFieldValue('name',i_user_logegdIn_id);
	//alert('i_suervisor'+i_suervisor);
	var parentId = nlapiSubmitRecord(record, true);
	
	var sublistCount = nlapiGetLineItemCount('custpage_sublist');
	
	for(var i=1; i<=sublistCount;i++)
		{
			var s_item = nlapiGetLineItemValue('custpage_sublist','sublistitem',i);
			
			var i_description = nlapiGetLineItemValue('custpage_sublist','sublistquantity',i);
			var i_quantity = nlapiGetLineItemValue('custpage_sublist','sublistdesc',i);
			var i_pricelevel = nlapiGetLineItemValue('custpage_sublist','sublistpricelevel',i); // check this
			//alert('s_billinfitem'+s_billinfitem+'  '+i_originalamt+ ' '+i_srevisedamt );
			var chieldRecord = nlapiCreateRecord('customrecord_subrecord_expense_form');
			chieldRecord.setFieldValue('custrecord_item',s_item);
			chieldRecord.setFieldValue('custrecord_quantity',i_description);
			chieldRecord.setFieldValue('custrecord_description',i_quantity);
			chieldRecord.setFieldValue('custrecord_pricelevel',i_pricelevel);
			//alert('parentId'+parentId);
			chieldRecord.setFieldValue('custrecord84',parentId);
			//alert('parentIdIdAfter');
			var chieeldRecId = nlapiSubmitRecord(chieldRecord,true);
			//alert('Chield Created ='+chieeldRecId);
		}
		
		var url = nlapiResolveURL('SUITELET','customscript_expenseformsuitelet', 'customdeploy1');
		////alert('url= '+url);
	
		window.location.href = url;
}
function create_claim()
{
	var rec_id=nlapiGetRecordId(); // Record ID
	var rec_Type = nlapiGetRecordType();
	var recObj = nlapiLoadRecord(rec_Type,rec_id);
	var claimNo = recObj.getFieldValue('custrecord_claimnumber');
	var salesorderSearch = nlapiSearchRecord("salesorder",null,
			[
			   ["type","anyof","SalesOrd"], 
			   "AND", 
			   ["tranid","is",claimNo], 
			   "AND", 
			   ["mainline","is","T"]
			], 
			[
			   new nlobjSearchColumn("internalid"), 
			   new nlobjSearchColumn("trandate").setSort(false), 
			   new nlobjSearchColumn("asofdate") 
			  
			]
			);
	var internalId = salesorderSearch[0].getValue('internalid');
	//alert('internalId'+internalId);
	var url = nlapiResolveURL('RECORD','salesorder',internalId);
	window.location.href = url;
}

