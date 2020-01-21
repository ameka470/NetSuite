/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/runtime', 'N/email', 'N/error'],

function(record, search, runtime, email, error) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(context) {
    	try{
    	//log.debug({title: 'context',details: context.type});
    	var salesorderSearchObj = search.create({
    		   type: "salesorder",
    		   filters:
    		   [
    		      ["type","anyof","SalesOrd"], 
    		      "AND", 
    		      ["systemnotes.field","anyof","CUSTBODY_SXRD_ADJUSTER"], 
    		      "AND", 
    		      ["systemnotes.type","any",""], 
    		      "AND",
                 //["systemnotes.date","within","yesterday"], 
               //   ["systemnotes.date","on","7/18/2019 12:00 am","7/22/2019 11:59 pm"],
    		      ["systemnotes.date","within","today"], 
    		      "AND", 
    		      ["custbody_sxrd_adjuster.custentity_assignment_for_task","is","F"], 
    		     "AND", 
    		      ["custbody_sxrd_adjuster.datecreated","onorafter","6/4/2019 12:00 pm"]
    		   ],
    		   columns:
    		   [
    		     // search.createColumn({name: "trandate", label: "Date"}),
    		     // search.createColumn({name: "type", label: "Type"}),
    		      search.createColumn({name: "tranid", summary: "GROUP", label: "Document Number"}),
    		    //  search.createColumn({name: "entity", label: "Name"}),
    		      search.createColumn({name: "custbody_sxrd_adjuster", summary: "GROUP", label: "Adjuster"})
    		   ]
    		});
    	var resultset = salesorderSearchObj.run();
        var results = resultset.getRange(0, 999);
        for (var i = 0; results != null && i < results.length; i++){
           // log.debug({ title: 'i',details: i});
            var result = results[i];
           // log.debug({title: 'result', details: result});
            var adjusterid = results[i].getValue({name:'custbody_sxrd_adjuster',summary: "GROUP"});
            log.debug({ title: 'adjusterid',details: adjusterid});
            var venRecord = record.load({ type: record.Type.VENDOR,id: adjusterid});
           // var adjusterSearch = search.lookupFields({type: search.Type.VENDOR,id: adjusterid,columns: 'custentity_assignment_for_task'});
       	 //log.debug('adjusterSearch',adjusterSearch);
       	// var istrue = adjusterSearch.custentity_assignment_for_task;
            var adjEntitiId = venRecord.getValue({ fieldId: 'entityid'});
            var adjEmail = venRecord.getValue({ fieldId: 'email'});
            var istrue = venRecord.getValue({ fieldId: 'custentity_assignment_for_task'});
            log.debug('istrue',istrue);
       	// var invoiceAdjusterId = invoiceAdjuster.custbody_sxrd_adjuster[0].value;
       	 if(istrue == false || istrue == 'null' || istrue == ''){
       		 log.debug('create task and set field to true');
       		//var venRecord = record.load({ type: record.Type.VENDOR,id: adjusterid});
       		//log.debug('venRecord',venRecord);
       		
       		venRecord.setValue({fieldId: 'custentity_assignment_for_task', value: true, ignoreFieldChange: true});
       		var recordId = venRecord.save();
       		//log.debug('recordId',recordId);
       		var taskRecord = record.create({type: record.Type.TASK });//,defaultValues: null
       		//.setValue{title:'start', priority : 'medium', status: 'notStarted', company: recordId, assigned: 22085} });
       		taskRecord.setValue({fieldId: 'title',value: adjEntitiId});;
   // ignoreFieldChange: true
       		taskRecord.setValue({fieldId: 'priority',value: 'MEDIUM'});
    		taskRecord.setValue({fieldId: 'status',value: 'NOTSTART'});
    		taskRecord.setValue({fieldId: 'company',value: recordId});
    		taskRecord.setValue({fieldId: 'assigned', value: 29222});
    		taskRecord.setValue({fieldId: 'sendemail', value: false});
    		//taskRecord.setValue({fieldId: 'startdate'value: 4/9/2019});
    		//taskRecord.setValue({fieldId: 'duedate' value: 4/9/2019});
    		taskid = taskRecord.save();
    		//log.debug('taskid',taskid);
           email.send({
	 			author: 22085,
	 			recipients: 'andrew@470claims.com',
	 			subject:'Adjuster assigned to First Claim: '+adjEntitiId,
	 			body:'Adjuster Name: '+adjEntitiId+'\n\n Email: '+adjEmail+'\n\n\n Thank you,\n\nFourseventy Claims',
	 			replyTo: 'no-reply@470.com',
	 		 });
       		 }
       	 }
    	}catch(e){
    		log.debug('onRequest_error', 'ERROR : ' + e.message);
  		  log.debug('ERROR', 'ERROR : ' + e);
    	}
    }

    return {
        execute: execute
    };
    
});
