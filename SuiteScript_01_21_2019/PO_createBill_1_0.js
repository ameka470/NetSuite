/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       15 Sep 2018     ameka
 *
 */

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
function transformToVendorBill() {
	try{

//Get Sales Order Details from Purchase Order
	var tranid = nlapiGetFieldValue('tranid');
	nlapiLogExecution('DEBUG','Purchase Order Number', tranid);
	var claim_num = nlapiGetFieldValue('custbody_claim_num');
	nlapiLogExecution('DEBUG','Claim Number', claim_num);
	var carrier_name = nlapiGetFieldValue('custbody_carrier_name_po');
	nlapiLogExecution('DEBUG','Customer Internal Id', carrier_name);

	//Search for sales order details via Claim# and get Internal ID
	var salesorderSearch = nlapiSearchRecord("salesorder",null,
     		  [
     		     ["type","anyof","SalesOrd"],
     		     "AND",
     		     ["mainline","is","T"],
     		     "AND",
						 ["numbertext","is",claim_num],
   			 		"AND",
   					["name","anyof",carrier_name]
     		  ],
     		  [ new nlobjSearchColumn("internalid")]
				);
				if(salesorderSearch && salesorderSearch.length < 2)
 			{
 			nlapiLogExecution('Debug', 'Sales Order Search Length',salesorderSearch.length);
 			 var soId = salesorderSearch[0].getValue('internalid');
 			 nlapiLogExecution('Debug', 'soId',soId);

	//Transform Purchase Record to Vendor Bill and assign Claim Number to Bill
	var customerpayment = nlapiTransformRecord('purchaseorder', nlapiGetRecordId(), 'vendorbill');
	var origForm = customerpayment.getFieldValue('customform');
	nlapiLogExecution('DEBUG','origForm', origForm);
			customerpayment.setFieldValue('customform',107);
			if(soId){
		customerpayment.setFieldValue('custbody_sxrd__created_from',soId);
		}else{
			 nlapiLogExecution('DEBUG', 'No SO ID Found',soId);
		}

		//Submit Vendor Bill
	var cpId = nlapiSubmitRecord(customerpayment, true);
		nlapiLogExecution('DEBUG','cpId', cpId);
	}
}catch (e){
		nlapiLogExecution('ERROR','Execption Occured', e);
	}
}
