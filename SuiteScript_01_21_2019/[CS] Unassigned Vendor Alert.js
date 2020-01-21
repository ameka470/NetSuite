/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord'],

function(currentRecord) {
    

     //var recObject = currentRecord.get();
    function UnassignedAdjuster(context) {
    	
    	if(context.fieldId == 'custbody_sxrd_fee_schedule'){
    		var recObject = context.currentRecord;
    		var feeschedule = recObject.getValue({fieldId:'custbody_sxrd_fee_schedule'});
    		//alert(feeschedule,'feeschedule');
    		if(feeschedule != null && feeschedule !=''){
    		var unassignedAdjuster = recObject.getValue({fieldId: 'custbody_sxrd_adjuster'});
        	//alert(unassignedAdjuster,'custbody_sxrd_adjuster');
        	if(unassignedAdjuster == '24041'){
    		alert('Please change Adjuster. Adjuster is not assigned');
        	}
    	}
    	}
    }

   

    return {
        //pageInit: pageInit,
    	fieldChanged: UnassignedAdjuster,
        //postSourcing: postSourcing,
        //sublistChanged: sublistChanged,
        //lineInit: lineInit,
        //validateField: validateField,
        //validateLine: validateLine,
        ///validateInsert: validateInsert,
        //validateDelete: validateDelete,
        //saveRecord: saveRecord
    };
    
});
