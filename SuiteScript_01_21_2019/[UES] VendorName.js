/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/search','N/record'],

function(runtime,search,record) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(context) {
    	var rec= context.newRecord;
    	var userRole = runtime.getCurrentUser();
    	//log.debug("Internal ID of current user role: " + userRole.role);
    	if(userRole.role == 1009){
    		var userObj = runtime.getCurrentUser();
    		//log.debug('userObj'+userObj);
    		//log.debug('Internal ID of current user: '+userObj.id);
    		//log.debug('Email ID of current user: '+userObj.email);
    		var ven_email = userObj.email;
    		var vendorSearchObj = search.create({
    			   type: "vendor",
    			   filters:
    			   [
    			     // ["internalidnumber","equalto",userObj.id]
    			      ["email","is",ven_email]
    			   ],
    			   columns:
    			   [
    			      search.createColumn({
    			         name: "entityid",
    			         sort: search.Sort.ASC,
    			         label: "Name"
    			      }),
    			      search.createColumn({name: "custentity_sxrd_qb_id", label: "QB ID"}),
    			      search.createColumn({name: "custentity_sxrd_cms_user_id_vendor", label: "CMS User ID"}),
    			      search.createColumn({
    			         name: "formulatext",
    			         formula: "{entityid}",
    			         label: "Formula (Text)"
    			      }),
                     search.createColumn({name: "internalid", label: "Internal ID"})
    			   ]
    			});
    			var searchResultCount = vendorSearchObj.runPaged().count;
    			//log.debug("vendorSearchObj result count",searchResultCount);
    			vendorSearchObj.run().each(function(result){
    			   // .run().each has a limit of 4,000 results
    				//var vendorEntity = result.getValue({name:'entityid'})
    				var vendorEntity = result.id//getValue({name:'entityid'});
    				//alert('vendorEntity'+vendorEntity);
    				//log.debug('vendorEntity'+vendorEntity);
    				rec.setValue({fieldId: 'entity',value:vendorEntity});
    				//log.debug('success')
    			   return true;
    			});   
    			
    	}
    }



    return {
        beforeLoad: beforeLoad,
        //beforeSubmit: beforeSubmit,
        //afterSubmit: afterSubmit
    };
    
});
