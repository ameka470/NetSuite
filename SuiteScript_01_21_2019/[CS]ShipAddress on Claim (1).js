/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       06 Jul 2018     ameka
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function PageInit1(){
    var shipAddress='{"addr1":"'+nlapiGetFieldValue('shipaddr1')+'","city":"'+nlapiGetFieldValue('shipcity')+'","country":"'+nlapiGetFieldValue('shipcountry')+'","state":"'+nlapiGetFieldValue('shipstate')+'","zip":"'+nlapiGetFieldValue('shipzip')+'"}';
  //var shipAddress='{"addr1:"'+nlapiGetFieldValue('shipaddr1')+'"}';
nlapiSetFieldValue("custbody_shipp_address", shipAddress);
nlapiLogExecution('DEBUG','custbody_shipp_address', custbody_shipp_address);



}

function FieldChange1(){
//if(name=='entity'){
nlapiSetFieldValue("shipaddress", nlapiGetFieldValue('custbody_shipp_address'));
nlapiLogExecution('DEBUG','AfterChange', shipaddress);
//}
}
