/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Oct 2018     ameka
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
function deleteInvoice(type){
	if(type == 'delete'){
		try
	      {
			//var itemName = new Array();
		//Primary Info 	
		//invoiceid, invoicenumber,
		var invoiceRecordId = nlapiGetRecordId();
		//nlapiLogExecution('DEBUG', 'invoiceRecordId' , invoiceRecordId);
		var invoiceRecord = nlapiLoadRecord('invoice',invoiceRecordId);
		//nlapiLogExecution('DEBUG', 'invoiceRecord' , invoiceRecord);
		var invoiceNumber = nlapiGetFieldValue('tranid');
		 //nlapiLogExecution('DEBUG', 'invoiceNumber' , invoiceNumber);
		 //claimnumber
		 
		 var claimNumberid = nlapiGetFieldValue('createdfrom');
		 
		 //nlapiLogExecution('DEBUG', 'claimNumberid' , claimNumberid);
		 if(claimNumberid == null || claimNumberid == ''){
			 var claimNumber = 'null'	 
		 }else{
		 var claimNumber = nlapiLookupField('salesorder',claimNumberid,'tranid');
		 //nlapiLogExecution('DEBUG', ' claimNumber',  claimNumber);
		 }
		//customer
		var customer = nlapiGetFieldValue('entity');
		 //nlapiLogExecution('DEBUG', 'customer', customer);
		//adjuster
		var adjuster = nlapiGetFieldValue('custbody_sxrd_adjuster');
		 //nlapiLogExecution('DEBUG', 'adjuster', adjuster);
		 //policyNumber
		 var policyNumber = nlapiGetFieldValue('custbody12');
		 //nlapiLogExecution('DEBUG', 'policyNumber', policyNumber);
		 //470 EXAMINER / REVIEWER
		 var examiner = nlapiGetFieldValue('custbody_sxrd_examiner');
		 //nlapiLogExecution('DEBUG', 'examiner', examiner);
		 //CMS #
		 var cmsno = nlapiGetFieldValue('custbody_sxrd_cms_no');
		 //nlapiLogExecution('DEBUG', 'cmsno', cmsno);
		 //POSTINGPERIOD
		 var postingperiod = nlapiGetFieldValue('postingperiod');
		 //nlapiLogExecution('DEBUG', 'postingperiod', postingperiod);
		 //DATE
		 var date = nlapiGetFieldValue('trandate');
		 //nlapiLogExecution('DEBUG', 'date', date);
		 
		 //DUEDATE
		 var duedate1 = nlapiGetFieldValue('duedate');
		 //nlapiLogExecution('DEBUG', 'duedate1', duedate1);
		 //DATE OF LOSS
		 var dateofloss = nlapiGetFieldValue('custbody_sxrd_date_loss');
		 //nlapiLogExecution('DEBUG', 'dateofloss', dateofloss);
		 //DATE RECEIVED
		 var dateoreceived = nlapiGetFieldValue('custbody_sxrd_date_received');
		// nlapiLogExecution('DEBUG', 'dateoreceived', dateoreceived);
		//SALES EFFESTIVE DATE 
		 var saleseffectivedate = nlapiGetFieldValue('saleseffectivedate');
		 //nlapiLogExecution('DEBUG', 'saleseffectivedate', saleseffectivedate);
		//ITEMS BODY FIELDS
		 //fee schedule
		 var feescheduleF = invoiceRecord.getFieldValue('custbody_sxrd_fee_schedule');
		// nlapiLogExecution('DEBUG', 'feescheduleF', feescheduleF);
		 //OVERRIDE ADJUSTER COMMISION
		 var override_adj_commission = invoiceRecord.getFieldValue('custbody_sxrd_override_adj_comm');
		// nlapiLogExecution('DEBUG', 'override_adj_commission', override_adj_commission);
		 //GROSS LOSS
		 var grossloss = invoiceRecord.getFieldValue('custbody_sxrd_invoice_gross_loss');
		 //nlapiLogExecution('DEBUG', 'grossloss', grossloss);
		 //INOVICE TYPE
		 var invoicetype = invoiceRecord.getFieldValue('custbody_inv_type');
		 //nlapiLogExecution('DEBUG', 'invoicetype', invoicetype);
		 //Insured Info
		 //shipaddress
		 var shipaddress = invoiceRecord.getFieldValue('shipaddress');
		 //nlapiLogExecution('DEBUG', 'shipaddress', shipaddress);
		 //Insured Name
		 var insuredname = nlapiGetFieldValue('custbody_sxrd_insured_name');
		 //nlapiLogExecution('DEBUG', 'insuredname', insuredname);
		//Insured phone
		 var insuredphone = nlapiGetFieldValue('custbody_sxrd_insured_phone');
		// nlapiLogExecution('DEBUG', 'insuredphone', insuredphone);
		//Insured Email
		 var insuredemail = nlapiGetFieldValue('custbody_sxrd_insured_email');
		// nlapiLogExecution('DEBUG', 'insuredemail', insuredemail);
		 
		 //Amount info
		 //subtotal
		 var subtotalA = nlapiGetFieldValue('subtotal');
		// nlapiLogExecution('DEBUG', 'subtotalA', subtotalA);
		 //discount item
		 var discountitemA = nlapiGetFieldValue('discounttotal');
		// nlapiLogExecution('DEBUG', 'discountitemA', discountitemA);
		 //TOTAL TAX
		 var totaltaxA = nlapiGetFieldValue('taxtotal');
		// nlapiLogExecution('DEBUG', 'totaltaxA', totaltaxA);
		 //total
		 var totalA = nlapiGetFieldValue('total');
		// nlapiLogExecution('DEBUG', 'totalA', totalA);
		 //AMOUNT DUE
		 var amountdueA = nlapiGetFieldValue('amountremainingtotalbox');
		// nlapiLogExecution('DEBUG', 'amountdueA', amountdueA);
		 
		
		
		 var lineItemCount = invoiceRecord.getLineItemCount('item');
		// nlapiLogExecution('DEBUG', 'lineItemCount', lineItemCount);
		
		 var record = nlapiCreateRecord('customrecord_deleted_transactions1');
		 
		// nlapiLogExecution('DEBUG', 'record', record);
		 record.setFieldValue('custrecordd_invoice_number',invoiceNumber);
		// nlapiLogExecution('DEBUG', 'invoiceNumber',  record.setFieldValue('custrecordd_invoice_number',invoiceNumber));
		
		 record.setFieldValue('custrecord_d_claimnumber',claimNumber);
		 
		 record.setFieldValue('custrecordd_customer',customer);
		 record.setFieldValue('custrecord_d_adjuster',adjuster);
		 record.setFieldValue('custrecord85',shipaddress);
		 record.setFieldValue('custrecord_ipolicynumber',policyNumber);
		 record.setFieldValue('custrecord_custbody_sxrd_examiner',examiner);
		 record.setFieldValue('custrecord_custbody_sxrd_cms_no',cmsno);
		 record.setFieldValue('custrecord_postingperiod',postingperiod);
		 record.setFieldValue('custrecord_trandate',date);
		 record.setFieldValue('custrecord_duedate',duedate1);
		 record.setFieldValue('custrecord_custbody_sxrd_date_loss',dateofloss);
		 record.setFieldValue('custrecord_saleseffectivedate',saleseffectivedate);
		 record.setFieldValue('custrecord_custbody_sxrd_insured_name',insuredname);
		 record.setFieldValue('custrecord_custbody_sxrd_insured_phone',insuredphone);
		 record.setFieldValue('custrecord_custbody_sxrd_insured_email',insuredemail);
		 record.setFieldValue('custrecord_custbody_sxrd_fee_schedule',dateoreceived);
		 record.setFieldValue('custrecord_custbody_sxrd_fee_schedule',feescheduleF);
		 record.setFieldValue('custrecord_custbody_sxrd_override_adj_co',override_adj_commission);
		 record.setFieldValue('custrecord_custbody_sxrd_invoice_gross_l',grossloss);
		 record.setFieldValue('custrecord_custbody_inv_type',invoicetype);
		 //Amount info
		 record.setFieldValue('custrecordd_subtotal',subtotalA);
		 record.setFieldValue('custrecord_discounttotal',discountitemA);
		 record.setFieldValue('custrecordd_totaltax',totaltaxA);
		 record.setFieldValue('custrecordd_total',totalA);
		 record.setFieldValue('custrecord_d_amount_due',amountdueA);
		
		 
		 if(lineItemCount){
			 for (var i=1; i<=lineItemCount; i++){
				 var itemid = invoiceRecord.getLineItemValue('item', 'item', i);
				 //nlapiLogExecution('DEBUG', ' itemid',  itemid);
				
				 var quantityName = invoiceRecord.getLineItemValue('item', 'quantity', i);
				 //nlapiLogExecution('DEBUG', ' quantityName',  quantityName);
				 var adjudterName = invoiceRecord.getLineItemValue('item', 'custcol_sxrd_adjustor_amount', i);
				 //nlapiLogExecution('DEBUG', ' adjudterName',  adjudterName);
				 var taxName = invoiceRecord.getLineItemValue('item', 'istaxable', i);
				// nlapiLogExecution('DEBUG', ' taxName',  taxName);
				 var rateName = invoiceRecord.getLineItemValue('item', 'rate', i);
				//nlapiLogExecution('DEBUG', ' rateName',  rateName);
				 var amountI = invoiceRecord.getLineItemValue('item', 'amount', i);
				// nlapiLogExecution('DEBUG', ' amountI',  amountI);
				 var descriptionI = invoiceRecord.getLineItemValue('item', 'description', i);
				// nlapiLogExecution('DEBUG', ' descriptionI',  descriptionI);
				 
			 //}
		 record.insertLineItem('remachcustrecord86',i);
		 record.setLineItemValue('recmachcustrecord86', 'custrecordd_quantity', i, quantityName);
		 record.setLineItemValue('recmachcustrecord86', 'custrecord_d_items1', i, itemid);
		 record.setLineItemValue('recmachcustrecord86', 'custrecord_d_adjamount_amount', i, adjudterName);
		 record.setLineItemValue('recmachcustrecord86', 'custrecordd_tax', i, taxName);
		 record.setLineItemValue('recmachcustrecord86', 'custrecordd_rate', i, rateName);
		 record.setLineItemValue('recmachcustrecord86', 'custrecordd_amount_items', i, amountI);
		 record.setLineItemValue('recmachcustrecord86', 'custrecord_items_descrption', i, descriptionI);
			 
		 record.commitLineItem('remachcustrecord86');
			 }
		 var newRecordId = nlapiSubmitRecord(record,true);
		// nlapiLogExecution('DEBUG', 'newRecordId', newRecordId);
		//}
		}
	      }catch (e)
	      {
	        nlapiLogExecution('ERROR','e', e);
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
