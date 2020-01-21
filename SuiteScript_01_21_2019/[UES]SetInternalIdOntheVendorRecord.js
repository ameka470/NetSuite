/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Apr 2019     ameka
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
function setInternalIdofRecordAfterSubmit(type){
	 if(type == 'create'){
			var vendor_record = nlapiLoadRecord('vendor',nlapiGetRecordId());
		//  nlapiLogExecution('Debug','vendor_record',vendor_record);
			var vendorid = nlapiGetRecordId();
		//	nlapiLogExecution('Debug','vendorid',vendorid);
			
				vendor_record.setFieldValue('custentity_netsuite_adjsuter_id',vendorid);
			//	nlapiSubmitRecord(vendor_record);
		   
			
	 }
}
