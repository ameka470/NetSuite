/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/error', 'N/runtime', 'N/format', 'N/email'],

function(search, record, error, runtime, format, email) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {
    	return billSearchObj = search.create({
  		   type: "vendorbill",
 		   filters:
 		   [
 		      ["type","anyof","VendBill"], 
 		      "AND", 
 		      ["mainline","is","T"], 
 		      "AND", 
 		     ["custbody_sxrd__created_from","noneof","@NONE@"]
 		   ],
 		   columns:
 		   [
 		      search.createColumn({name: "internalid", label: "Internal ID"}),
 		      search.createColumn({name: "tranid", label: "Document Number"}),
 		      search.createColumn({name: "entity", label: "Name"}),
 		     search.createColumn({name: "custbody_sxrd__created_from", label: "Created From"}), 
 		   ]
 		});
    		
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	var rowJson =JSON.parse(context.value);
   //    	log.debug('rowJson', rowJson);
       	var billInternalid = rowJson.values['internalid'].value;
       	log.debug('billInternalid',billInternalid);
       	var billCreatedFrom= rowJson.values['custbody_sxrd__created_from'].value;
       	log.debug('billCreatedFrom',billCreatedFrom);
        var billTranid = rowJson.values['tranid'].value;
       	log.debug('billTranid',billTranid); 
      // 	if(invCarrierName == ' ' || invCarrierName == null){
       	var claimEntity = search.lookupFields({
		    type: search.Type.SALES_ORDER,
		    id: billCreatedFrom,
		    columns: ['entity']
		});
       	log.debug('claimEntity',claimEntity);
       	var claimNme = claimEntity.entity;
       	var claimCarrierNmae = claimNme[0].value;
       	log.debug('claimCarrierNmae',claimCarrierNmae);
       	var id = record.submitFields({
       	    type: record.Type.VENDOR_BILL,
       	    id: billInternalid,
       	    values: {
       	    	custbody_carrier_name_po: claimCarrierNmae
       	    }
       	   
       	});
        context.write({key : billInternalid, value: claimCarrierNmae});
       
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	
         	
    	
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	handleErrorIfAny(summary);
    }
    function handleErrorAndSendNotification(e, stage)
    {
        log.error('Stage: ' + stage + ' failed', e);

        var author = 22085;
        var recipients = 'ameka@470claims.com';
        var subject = 'Map/Reduce script ' + runtime.getCurrentScript().id + ' failed for stage: ' + stage;
        var body = 'An error occurred with the following information:\n' +
                   'Error code: ' + e.name + '\n' +
                   'Error msg: ' + e.message;

        email.send({
            author: author,
            recipients: recipients,
            subject: subject,
            body: body
        });
    }

    function handleErrorIfAny(summary)
    {
        var inputSummary = summary.inputSummary;
        log.debug("inputSummary",inputSummary);
        var mapSummary = summary.mapSummary;
        log.debug("mapSummary",mapSummary);
        var reduceSummary = summary.reduceSummary;
        log.debug("reduceSummary",reduceSummary);

        if (inputSummary.error)
        {
            var e = error.create({
                name: 'INPUT_STAGE_FAILED',
                message: inputSummary.error
            });
            log.debug("e",e);
           handleErrorAndSendNotification(e, 'getInputData');
        }

        handleErrorInStage('map', mapSummary);
       // handleErrorInStage('reduce', reduceSummary);
    }

    function handleErrorInStage(stage, summary)
    {
        var errorMsg = [];
        summary.errors.iterator().each(function(key, value){
            var msg = 'Failed to create bill: ' + key + '. Error was: ' + JSON.parse(value).message + '\n';
            errorMsg.push(msg);
            return true;
        });
        if (errorMsg.length > 0)
        {
            var e = error.create({
                name: 'Update Vendor Bill Record Failed',
                message: JSON.stringify(errorMsg)
            });
            handleErrorAndSendNotification(e, stage);
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
