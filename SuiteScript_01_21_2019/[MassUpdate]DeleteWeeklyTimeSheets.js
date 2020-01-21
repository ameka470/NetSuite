/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Sep 2019     ameka
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massDeleteWeeklyTimeSheets(recType, recId) {
	nlapiDeleteRecord(recType, recId);
}
