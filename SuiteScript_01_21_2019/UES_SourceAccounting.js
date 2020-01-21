/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 May 2018     Anusha PC
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
	nlapiLogExecution('debug','Type ',type)
;	var o_context = nlapiGetContext();
	var i_user_logegdIn_id = o_context.getUser();
	if(type =='view')
		{
		 var approvalStatus = nlapiGetFieldValue('custrecord81');
		 var nextApprovar = nlapiGetFieldValue('custrecord82');
		 nlapiLogExecution('debug','approvalStatus='+approvalStatus,'nextApprovar'+nextApprovar);
		 if(approvalStatus== 3 && nextApprovar==i_user_logegdIn_id)
		 {
		 form.addButton('custpage_clainmbutton', 'Create Claim','create_claim()');
		 form.setScript('customscript_cliexpenseapproval');
		 }
		}
 
}
