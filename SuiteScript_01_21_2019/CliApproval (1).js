/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 May 2018     Anusha PC
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */

function pageinit()
{
	//alert('In pageinit');
}

function send_approval()
{
	
	var CarriarName = nlapiGetFieldValue('custpage_invnum2');
	//alert('CarriarName = '+CarriarName);
	var claimNumber = nlapiGetFieldValue('custpage_invnum3');
	//alert('Claim Number ='+claimNumber);
	var invoiceNumber = nlapiGetFieldValue('custpage_invnum4');
	//alert('Invoice Number='+invoiceNumber);
	var adjusterName = nlapiGetFieldValue('custpage_invnum5');
	//alert('Adjuster Name='+adjusterName)
	var reason = nlapiGetFieldValue('custpage_invnum6');
	//alert('reason='+reason);
	var requestedBy = nlapiGetFieldValue('custpage_invnum7');
	//alert('requestedBy='+requestedBy);
	var date1 = nlapiGetFieldValue('date');
	var i_suervisor = nlapiGetFieldValue('custpage_supervisor');
	var record = nlapiCreateRecord('customrecord_invadireqrecord');
	
	//record.setFieldValue('name','Invoice Adjustment');
	
	record.setFieldValue('custrecord_carriar_name',CarriarName);
	record.setFieldValue('custrecord_claim_number',claimNumber);
	record.setFieldValue('custrecord_invoice_number',invoiceNumber);
	record.setFieldValue('custrecord_adjuster_name',adjusterName);
	record.setFieldValue('custrecord_reason',reason);
	record.setFieldValue('custrecord_requested_by',requestedBy);
	record.setFieldValue('custrecord_date',date1);
	record.setFieldValue('custrecord_next_approver',i_suervisor);
	record.setFieldValue('custrecord_approvalstatus',1);
	//alert('i_suervisor'+i_suervisor);
	var parentId = nlapiSubmitRecord(record, true);
	
	var sublistCount = nlapiGetLineItemCount('custpage_sublist');
	
	for(var i=1; i<=sublistCount;i++)
		{
			var s_billinfitem = nlapiGetLineItemValue('custpage_sublist','sublistid',i);
			
			var i_originalamt = nlapiGetLineItemValue('custpage_sublist','sublistname',i);
			var i_srevisedamt = nlapiGetLineItemValue('custpage_sublist','sublistemail',i);
			//alert('s_billinfitem'+s_billinfitem+'  '+i_originalamt+ ' '+i_srevisedamt );
			var chieldRecord = nlapiCreateRecord('customrecord_chieldrecordinvoiceadj');
			chieldRecord.setFieldValue('custrecord_billingitem',s_billinfitem);
			chieldRecord.setFieldValue('custrecord_originalamt',i_originalamt);
			chieldRecord.setFieldValue('custrecord_revisedamt',i_srevisedamt);
			//alert('parentId'+parentId);
			chieldRecord.setFieldValue('custrecord_parentid',parentId);
			//alert('parentIdIdAfter');
			var chieeldRecId = nlapiSubmitRecord(chieldRecord,true);
			//alert('Chield Created ='+chieeldRecId);
		}
		var url = nlapiResolveURL('SUITELET','customscript_invoiceadj', 'customdeploy3');
		////alert('url= '+url);
	
		window.location.href = url;
}
