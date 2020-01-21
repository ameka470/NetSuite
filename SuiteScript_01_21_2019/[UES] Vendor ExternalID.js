/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Jul 2018     ameka
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
function vendor_external_id(type){
	 if(type == 'create'){
			var vendor_record = nlapiLoadRecord('vendor',nlapiGetRecordId());
		  nlapiLogExecution('Debug','vendor_record',vendor_record);
			var externalId = nlapiGetFieldValue('custentity_sxrd_cms_user_id_vendor');
		  nlapiLogExecution('Debug','externalId',externalId);
			if(externalId){
				vendor_record.setFieldValue('externalid',externalId);
				nlapiSubmitRecord(vendor_record);
		    }if(externalId == null){
		    	alert('Please enter CMS User ID');
		    }
			
	 }
}
