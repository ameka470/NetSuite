/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 May 2018     ameka
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
	//var contact = nlapiLoadRecord(contact);
	//nlapiGetField('mobilephone').setDisplayType('disabled');
	var contact = nlapiSetFieldValue('contactrole',1);
	//nlapiGetField('contactrole').setDisplayType('hidden');
	nlapiGetField('entityid').setDisplayType('hidden');
}
