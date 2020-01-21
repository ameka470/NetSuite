/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'],

function(record) {
   
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
      try{
    	 rec = scriptContext.newRecord;
         var extId = rec.getValue({fieldId: 'externalid'});
        // log.debug('extId',extId)
         var salesforceid = rec.getValue({fieldId: 'custentity_salesdforce_id'});
         //log.debug('salesforceid',salesforceid)
                 if (salesforceid != extId)
                   {
                     record.submitFields({
                     type: record.Type.VENDOR,
                     id: rec.id,
                     values: {
                         'externalid': salesforceid
                     }
                     });
                   }
         
         		var newext = rec.getValue({fieldId: 'externalid'});
               //  log.debug('rec id',rec.id)
               }catch(e){
    		log.debug('onRequest_error', 'ERROR : ' + e.message);
  		  log.debug('ERROR', 'ERROR : ' + e);
    	}
    }

    return {
       // beforeLoad: beforeLoad,
       // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
