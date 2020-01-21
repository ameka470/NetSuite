/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
/**
 * Script Type          : USER EVENT Script
 * Script Name          : SXRD_UE_feeSchedule.js
 * Version              : 2.0
 * Author               : T.G.Mounika
 * Start Date           : 29/11/2017
 * Last Modified Date   : 29/11/2017
 * Description          : Creating calculate fee schedule amount button and adjuster amount button in create and edit mode of salesorder.  
 */ 
define(['N/ui/serverWidget','N/log'],

function(log,serverWidget) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {
    	try{
    	var recordObj=scriptContext.form;
    	if( scriptContext.type == 'create' || scriptContext.type == 'edit' || scriptContext.type == 'copy'){
    	
    		var itemSublist=recordObj.getSublist({id:'item'});		//Creating calculate fee schedule amount and adjuster amount buttons on salesorder in create and edit mode
    		var feeScheduleAmt = itemSublist.addButton
    	({
    	    id : 'custpage_buttonfee',
    	    label : 'Calculate Fee Schedule Amount',
    	    functionName : "feeScheduleAmount"
    	});
    		var AdjusterAmt = itemSublist.addButton
        	({
        	    id : 'custpage_buttonadj',
        	    label : 'Calculate Adjuster Commission',
        	    functionName : "adjusterCommission"
        	});
    	}
    	recordObj.clientScriptFileId = 1765;//'SuiteScripts/SXRD_CS_feeSchedule.js'; //Triggres Client script
    	}catch(error){
    		log.debug("Error:",error);
    	}
    }
    
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {

    }

    return {
        beforeLoad: beforeLoad
    };
    
});
