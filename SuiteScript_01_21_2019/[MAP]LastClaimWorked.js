/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/error', 'N/runtime', 'N/format', 'N/task', 'N/email'],

function(search, record, error, runtime, format, task, email) {
   
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
	function rescheduleCurrentScript() {
		  var scheduledScriptTask = task.create({
            taskType: task.TaskType.SCHEDULED_SCRIPT
        });
        scheduledScriptTask.scriptId = runtime.getCurrentScript().id;
        scheduledScriptTask.deploymentId = runtime.getCurrentScript().deploymentId;
        return scheduledScriptTask.submit();
    }
    function getInputData() {
    	return search.create({ //var vendorSearchObj = 
 		   type: "vendor",
 		   filters:
 		   [
 			["formuladate: DECODE({transaction.type}, 'Bill', {transaction.trandate})","onorafter","yesterday"]
             // ["internalid","anyof","1771"]
 		   ],
 		   columns:
 		   [
 			   search.createColumn({name: "internalid",
 				   summary: "GROUP",
 				   label: "Internal ID"}),
 			   search.createColumn({
 		         name: "entityid",
 		         summary: "GROUP",
 		         sort: search.Sort.ASC,
 		         label: "Name"
 		      }),
 		      search.createColumn({
 		         name: "formuladatetime",
 		         summary: "MAX",
 		         formula: "DECODE({transaction.type}, 'Bill', {transaction.trandate})",
 		         label: "Formula (Date)"
 		      })
 		   ]
 		});
    	var resultset = vendorSearchObj.run();
        var results = resultset.getRange(0, 999);
       // log.debug("results.length: " , results.length);
   /*    for (var i = 0; results != null && i < results.length; i++){
    	   log.debug("results.length: " , i);
       	 log.debug("Rescheduling status debug: " , runtime.getCurrentScript().getRemainingUsage());
       	if (runtime.getCurrentScript().getRemainingUsage() < 500) {
               var taskId = rescheduleCurrentScript();
               log.debug("Rescheduling status: " + task.checkStatus(taskId));
               return;
           }
       	
       	
       	 var result = results[i]; 
       	 log.debug('result'+result);
       	 var adjusterId = results[i].getValue({name: 'internalid', summary: 'GROUP'});
       	 log.debug('adjusterId'+adjusterId);
       	 var adjusterName = results[i].getValue({name: 'entityid', summary: 'GROUP'});
       	 log.debug('adjusterName'+adjusterName);
       	 var adjusterDate= results[i].getValue({name: 'formuladatetime', summary: 'MAX'});
       	 log.debug('adjusterDate'+adjusterDate);
       }*/
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	if (runtime.getCurrentScript().getRemainingUsage() < 500) {
            var taskId = rescheduleCurrentScript();
        //    log.debug("Rescheduling status: " + task.checkStatus(taskId));
            return;
        }
    	var rowJson =JSON.parse(context.value);
     //  	log.debug('rowJson', rowJson);
       	 var adjusterId = rowJson.values['GROUP(internalid)'].value;
      // 	 log.debug('adjusterId',adjusterId);
       	 var adjusterName= rowJson.values['GROUP(entityid)'];
      // 	 log.debug('adjusterName',adjusterName);
      var adjusterDate = rowJson.values['MAX(formuladatetime)'];
     //  	 log.debug('adjusterDate',adjusterDate); 
       	if(adjusterDate == ' ' || adjusterDate == null){
   		// log.debug({title: 'adjusterDate Value is Null',details: 'isNull'+adjusterDate+'isNull'}); 
   	 }else{
   		// log.debug({title: 'adjusterDate Value is Null1',details: 'isNull'+adjusterDate+'isNull'});
   		 var tempVar = adjusterDate.split(' ');
   //		 log.debug({title: 'tempVar',details: tempVar});
   		 //tempVar[1] += ':00'
   		 var formattedadjusterDate = tempVar[0]// + " " + tempVar[1] + " " + tempVar[2]
   	//	 if(formattedadjusterDate != ' ' || formattedadjusterDate != null){
   	//	 log.debug({title: 'adjusterDate Value',details: adjusterDate});
   	//	 log.debug({title: 'adjusterDate Type',details: typeof adjusterDate });    
   	//	 log.debug({ title: 'formattedadjusterDate Value',details: formattedadjusterDate});
   	//	 log.debug({title: 'formattedadjusterDate Type',details: typeof formattedadjusterDate});    

   		 var parsedSampleDate = format.parse({value: formattedadjusterDate,type: format.Type.DATE});

   	//	 log.debug({title: 'Parsed Sample Date Value',details: parsedSampleDate});
   	//	 log.debug({ title: 'Parsed Sample Date Type',details: typeof parsedSampleDate});
   		// var vendorLoad = record.load({type: record.Type.VENDOR, id: adjusterId});
   		var vendorRecordId = record.submitFields({type: record.Type.VENDOR,id: adjusterId,
   		    values: { custentity_last_claim_worked: parsedSampleDate},
   		    options: {enableSourcing: false,ignoreMandatoryFields : true}
   		}); 
           //log.debug('vendorLoad',vendorLoad);
         //  vendorLoad.setValue({fieldId:'custentity_last_vednor_bill',value:parsedSampleDate});
        //   var vendorRecordId = vendorLoad.save();
           log.debug('vendorRecordId',vendorRecordId);
   //        log.debug("End of the script Usage: " , runtime.getCurrentScript().getRemainingUsage());
           context.write({key : vendorRecordId, value  : vendorRecordId});
   	//	 }
   	}
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
    //    log.debug("inputSummary",inputSummary);
        var mapSummary = summary.mapSummary;
    //    log.debug("mapSummary",mapSummary);
        var reduceSummary = summary.reduceSummary;
    //    log.debug("reduceSummary",reduceSummary);

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
                name: 'Update Vendor Record Failed',
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
