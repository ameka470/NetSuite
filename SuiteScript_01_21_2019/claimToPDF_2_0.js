	 /**
	  * @NApiVersion 2.x
	  * @NScriptType UserEventScript
	  */
	 define(['N/record','N/render','N/email', 'N/search', 'N/runtime', 'N/error', 'N/log'],
	 function(record,render,email, search, runtime, error, log) {
		 function beforeSubmit(context){
			 
			 if(context.type == context.UserEventType.EDIT ||context.type == context.UserEventType.CREATE){
			 var object = context.newRecord;
	    	 var salesorderInternalid = context.newRecord.id;
	    	 var documentnumber = object.getValue({
	 	          fieldId: 'tranid'
	 	      });
	    	 var customer = object.getValue({
	 	          fieldId: 'entity'
	 	      });
	    	 if(customer == '214' || customer == '47' || customer == '71'){
	    		// log.debug({title: 'customer',details: customer});
		 			
	    	
	      
	       var adjuster = object.getValue({
	          fieldId: 'custbody_sxrd_adjuster'
	      });
	       if(adjuster){
	     //  log.debug({title: 'adjuster',details: adjuster});
	       var adjusterPhone = search.lookupFields({              // Search for Invoice Number
			    type: search.Type.VENDOR,
			    id: adjuster,
			    columns: 'phone'
			});
	      
	     //  log.debug({title: 'adjusterPhone',details: adjusterPhone});
	       var adjusterEmail  =  search.lookupFields({              // Search for Invoice Number
			    type: search.Type.VENDOR,
			    id: adjuster,
			    columns: 'email'
	       });
	      
			//    log.debug({title: 'adjusterPhone',details: adjusterPhone});
			    var adjustermobilephone  =  search.lookupFields({  type: search.Type.VENDOR,id: adjuster, columns: 'mobilephone'});
	       if(adjusterEmail){
			    var adjemail = adjusterEmail.email;
			   //   log.debug({title: 'adjusterEmail',details: email});
			    object.setValue({fieldId:'custbody_adjuster_email',value:adjemail}); 
	       }
	       if(adjusterPhone){
			    var phone = adjusterPhone.phone;
			      // log.debug({title: 'adjusterPhone',details: phone});
			    	
	    		 object.setValue({fieldId:'custbody_adjuster_phone',value:phone}); 
	 		   //Get line count
	    		// log.debug({title: 'custbody_adjuster_email',details: 'custbody_adjuster_email'});
	    		// log.debug({title: 'custbody_adjuster_phone',details: 'custbody_adjuster_phone'});
	       }
	       if(adjustermobilephone){
			    var mobphone = adjustermobilephone.mobilephone;
			    //   log.debug({title: 'mobphone',details: mobphone});
			    	
	    		 object.setValue({fieldId:'custbody_adjuster_mob_phone',value:mobphone}); 
	 		   //Get line count
	    		// log.debug({title: 'custbody_adjuster_email',details: 'custbody_adjuster_email'});
	    		// log.debug({title: 'custbody_adjuster_phone',details: 'custbody_adjuster_phone'});
	       }
	    	 }
	       }
		 }
		 }
		 
		 
		// var exports = {};
	     function afterSubmit(context){
	    	
	    // }
	     
	    // function something(){
	    	 var object = context.newRecord;
	    	 var salesorderInternalid = context.newRecord.id;
	    	 var documentnumber = object.getValue({
	 	          fieldId: 'tranid'
	 	      });
           log.debug({title: 'documentnumber',details: documentnumber});
	    	 var customer = object.getValue({
	 	          fieldId: 'entity'
	 	      });
	    	 if(customer == '214' || customer == '47'){
	    		// log.debug({title: 'customer',details: customer});
		 			
	    	
	      
	       var adjuster = object.getValue({
	          fieldId: 'custbody_sxrd_adjuster'
	      });
	       if(adjuster){
	     //  log.debug({title: 'adjuster',details: adjuster});
	       var adjusterPhone = search.lookupFields({              // Search for Invoice Number
			    type: search.Type.VENDOR,
			    id: adjuster,
			    columns: 'phone'
			});
	     
	       var adjusterEmail  =  search.lookupFields({              // Search for Invoice Number
			    type: search.Type.VENDOR,
			    id: adjuster,
			    columns: 'email'
			});
	       
	    	 if(context.type == context.UserEventType.CREATE){
	 		  
	    		
	 	      
	 		  if(adjuster != "" || adjuster != "null" || adjuster != 24041){
	 		  
	 		  
	 		  //Print --> convert the record into a PDF or HTML object 
	 		  var TransactionPdfObj = render.transaction({
	 			 entityId:salesorderInternalid,
	 			 printMode:render.PrintMode.PDF
	 		  });
	 		// log.debug({title: 'Email Sent',details: 'Email Sent'});
	 		 //Email PDF object to recipient 
	 		var recipientslist = ['claims@ngic.com','natgenacks@470claims.com'];
		 		 //Email PDF object to recipient 
		 		 //email.send({
		 		  email.sendBulk({
	 			author: 22085,
	 			recipients: recipientslist,
	 			subject:'Claim: '+documentnumber+'-NGLS-IA Adjuster Acknowledgement',
	 			body:'Claim Number: '+documentnumber+'\n\n IA Adjuster acknowledgement attached to this message.\n\n\n Thank you,\n\nFourseventy Claims',
	 			replyTo: 'no-reply@470.com',
	 			attachments:[TransactionPdfObj]
	 		 });
	 		  }
	    	// }
	    	 }else if(context.type == context.UserEventType.EDIT){
	    		if (fieldWasChanged(context) == true){

			//	 log.debug({title: 'debug',details: 'default adjuster was changed'});
				 var TransactionPdfObj = render.transaction({
	  	 			 entityId:salesorderInternalid,
	  	 			 printMode:render.PrintMode.PDF
	  	 		  });
	  	 	//	log.debug({title: 'done',details: 'done'});
	  	 		 //Email PDF object to recipient 
	  	 		 var recipientslist = ['claims@ngic.com','natgenacks@470claims.com'];
	  	 		 email.sendBulk({
	  	 			author:22085,
	  	 			recipients: recipientslist,
	  	 			subject:'Claim: '+documentnumber+'-NGLS-IA Adjuster Acknowledgement',
	  	 			body:'Claim Number: '+documentnumber+'\n\n IA Adjuster acknowledgement attached to this message.\n\n\n Thank you,\n\nFourseventy Claims',
	  	 			replyTo: 'no-reply@470.com',
	  	 			attachments:[TransactionPdfObj]
	  	 		 });
	    		 }
	    	 }
		   }
	      }else if(customer == '71'){
	    	//  log.debug({title: 'customer',details: customer});
	 			var insured = object.getValue({
			          fieldId: 'custbody_sxrd_insured_name'
			      });
		    	
		       var adjuster = object.getValue({
		          fieldId: 'custbody_sxrd_adjuster'
		      });
		       if(adjuster){
		   //    log.debug({title: 'adjuster',details: adjuster});
		       var adjusterPhone = search.lookupFields({              // Search for Invoice Number
				    type: search.Type.VENDOR,
				    id: adjuster,
				    columns: 'phone'
				});
		     
		       var adjusterEmail  =  search.lookupFields({              // Search for Invoice Number
				    type: search.Type.VENDOR,
				    id: adjuster,
				    columns: 'email'
				});
		       
		    	 if(context.type == context.UserEventType.CREATE){
		 		  
		    		
		 	      
		 		  if(adjuster != "" || adjuster != "null" || adjuster != 24041){
		 		  
		 		  
		 		  //Print --> convert the record into a PDF or HTML object 
		 		  var TransactionPdfObj = render.transaction({
		 			 entityId:salesorderInternalid,
		 			 printMode:render.PrintMode.PDF
		 		  });
		 		 log.debug({title: 'Tower Hill Email Sent',details: 'Email Sent'});
		 		 var recipientslist = ['thig@470claims.com', 'claims@thig.com'];
		 		 //Email PDF object to recipient 
		 		 // email.send({
		 		 email.sendBulk({
                  
		 			author: 22085,
		 			recipients: recipientslist,
		 			subject:documentnumber+', '+insured,
		 			body:'FILENO: '+documentnumber+'\n\n IA Adjuster acknowledgement attached to this message.\n\n\n Thank you,\n\nFourseventy Claims',
		 			replyTo: 'no-reply@470.com',
		 			attachments:[TransactionPdfObj]
		 		 });
		 		  }
		    	// }
		    	 }else if(context.type == context.UserEventType.EDIT){
		    		if (fieldWasChanged(context) == true){

					// log.debug({title: 'debug',details: 'default adjuster was changed'});
					 var TransactionPdfObj = render.transaction({
		  	 			 entityId:salesorderInternalid,
		  	 			 printMode:render.PrintMode.PDF
		  	 		  });
					 log.debug({title: 'Tower Hill Email Sent',details: 'Email Sent'});
		  	 		 //Email PDF object to recipient 
		  	 		var recipientslist = ['thig@470claims.com', 'claims@thig.com'];
		  	 	//	//email.send({
		  	 		 email.sendBulk({
                        
		  	 			author:22085,
		  	 			recipients: recipientslist,
		  	 			subject: documentnumber+', '+insured,
		  	 			body:'FILENO: '+documentnumber+'\n\n IA Adjuster acknowledgement attached to this message.\n\n\n Thank you,\n\nFourseventy Claims',
		  	 			replyTo: 'no-reply@470.com',
		  	 			attachments:[TransactionPdfObj]
		  	 		 });
		    		 }
		    	 }
			   }
	      }
	  }
	     function fieldWasChanged(context){
			 var rcdOld = context.oldRecord;// loading the old record 
    		// log.debug({title: 'rcdOld',details: rcdOld});
    		 var record  = context.newRecord;
    		// log.debug({title: 'record',details: record}); 
    		 if (!isAdjusterNotEqual(record, rcdOld)) {
    			// log.debug({title: 'return',details: return});
    		//	 log.debug({title: 'isAdjusterNotEqual(record, rcdOld)',details: isAdjusterNotEqual(record, rcdOld)});
    			  
    	        }else{
    	        	// log.debug({title: 'isAdjusterNotEqual(record, rcdOld)2',details: isAdjusterNotEqual(record, rcdOld)});
    	        	 return true; 
    	        }
    	 }
		 function isAdjusterNotEqual(record, rcdOld){
			 var oldAdjuster = rcdOld.getValue({fieldId: 'custbody_sxrd_adjuster'});
		//	 log.debug({title: 'oldAdjuster',details: oldAdjuster});
			 var newAdjuster = record.getValue({fieldId: 'custbody_sxrd_adjuster'});
		//	 log.debug({title: 'newAdjuster',details: newAdjuster});
		//	 log.debug({title: 'newAdjuster !== oldAdjuster',details:  ((newAdjuster !== oldAdjuster))});
			 return ((newAdjuster !== oldAdjuster));
			  
		
		 }
	  
	    // exports.afterSubmit = afterSubmit;
	    // return exports;
	   //  afterSubmit = afterSubmit;
	 	return{
	 		beforeSubmit: beforeSubmit,
	 		afterSubmit: afterSubmit
	 		
	 	};
	 });
	    		/* object.setValue({fieldId:'custbody_adjuster_email',value:adjusterEmail}); 
	    		 object.setText({fieldId:'custbody_adjuster_phone',value:adjusterPhone}); 
	    		 log.debug({title: 'custbody_adjuster_email',details: 'custbody_adjuster_email'});
	    		 log.debug({title: 'custbody_adjuster_phone',details: 'custbody_adjuster_phone'});*/
	    		 

	       
	          
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	    		 
	    	/*	var salesorderSearchObj = search.create({
	    			   type: "salesorder",
	    			   filters:
	    			   [
	    			      ["type","anyof","SalesOrd"], 
	    			      "AND", 
	    			      ["mainline","is","T"], 
	    			      "AND", 
	    			      ["systemnotes.field","anyof","CUSTBODY_SXRD_ADJUSTER"], 
	    			      "AND", 
	    			      ["name","anyof","214","47"], 
	    			      "AND", 
	    			      [["formulatext: {systemnotes.type}","is","Set"],"OR",["formulatext: {systemnotes.type}","is","Change"]],
	    			      "AND", 
	    			      ["internalidnumber","equalto",salesorderInternalid]
	    			   ],
	    			   columns:
	    			   [
	    			      search.createColumn({
	    			         name: "trandate",
	    			         sort: search.Sort.ASC,
	    			         label: "Date"
	    			      }),
	    			      search.createColumn({name: "datecreated", label: "Date Created"}),
	    			      search.createColumn({name: "tranid", label: "Document Number"}),
	    			      
	    			      search.createColumn({name: "type", label: "Type"}),
	    			      search.createColumn({
	    			         name: "type",
	    			         join: "systemNotes",
	    			         label: "Type"
	    			      }),
	    			      search.createColumn({
	    			         name: "field",
	    			         join: "systemNotes",
	    			         label: "Field"
	    			      }),
	    			      search.createColumn({
	    			         name: "oldvalue",
	    			         join: "systemNotes",
	    			         label: "Old Value"
	    			      }),
	    			      search.createColumn({
	    			         name: "newvalue",
	    			         join: "systemNotes",
	    			         label: "New Value"
	    			      }),
	    			      search.createColumn({
	    			         name: "context",
	    			         join: "systemNotes",
	    			         label: "Context"
	    			      }),
	    			      search.createColumn({name: "custbody_sxrd_adjuster", label: "Adjuster"})
	    			   ]
	    			});
	    		 
	    		  var resultset = salesorderSearchObj.run();
	    		
  		        var results = resultset.getRange(0, 999);
  		           if (results) {
  		        	
  		         //  for (var i = 0; results != null && i < results.length; i++){
  		        	 
  		                var result = results[0];
  		               
  		                var adjusterOldValue = results[0].getValue({name: 'oldvalue', join: 'systemNotes'});
  		                log.debug({title: 'adjusterOldValue',details: adjusterOldValue});
  		              var adjusterNewValue = results[0].getValue({name: 'newvalue', join: 'systemNotes'});
		                log.debug({title: 'adjusterNewValue',details: adjusterNewValue});
		                var adjustertype = results[0].getValue({name: 'type', join: 'systemNotes'});
		                log.debug({title: 'adjustertype',details: adjustertype});
		                
  		              if(adjuster != "" || adjuster != "null" || adjuster != 24041){
  		            if(adjustertype == "Change"){	  
  		  	 		  if(adjusterOldValue != " " || adjusterOldValue != "null")//{
  		  	 		  
  		  	 		  //Print --> convert the record into a PDF or HTML object 
  		  	 		  var TransactionPdfObj = render.transaction({
  		  	 			 entityId:salesorderInternalid,
  		  	 			 printMode:render.PrintMode.PDF
  		  	 		  });
  		  	 		log.debug({title: 'done',details: 'done'});
  		  	 		 //Email PDF object to recipient 
  		  	 		 email.send({
  		  	 			author:22085,
  		  	 			recipients: 'claims@ngic.com',
  		  	 			subject:'Claim: '+documentnumber+'-NGLS-IA Adjuster Acknowledgement',
  		  	 			body:'Claim Number: '+documentnumber+'\n\n IA Adjuster acknowledgement attached to this message.\n\n\n Thank you,\n\nFourseventy Claims',
  		  	 			replyTo: 'no-reply@470.com',
  		  	 			attachments:[TransactionPdfObj]
  		  	 		 });
  		  	 		// break;
  		  	    }else  if(adjusterOldValue == "" || adjusterOldValue == "null"){
  		            	var TransactionPdfObj = render.transaction({
  	  		  	 			 entityId:salesorderInternalid,
  	  		  	 			 printMode:render.PrintMode.PDF
  	  		  	 		  });
  	  		  	 		  
  	  		  	 		 //Email PDF object to recipient 
  	  		  	 		 email.send({
  	  		  	 			author:22085,
  	  		  	 			recipients: 'claims@ngic.com',
  	  		  	 			subject:'Claim: '+documentnumber+'-NGLS-IA Adjuster Acknowledgement',
  	  		  	 			body:'Claim Number: '+documentnumber+'\n\n IA Adjuster acknowledgement attached to this message.\n\n\n Thank you,\n\nFourseventy Claims',
  	  		  	 			replyTo: 'no-reply@470.com',
  	  		  	 			attachments:[TransactionPdfObj]
  	  		  	 		 });
  		              }
  		              }else if(adjustertype == "Set"){
  		            	if(adjusterOldValue == "" || adjusterOldValue == "null"){
  	  		            	var TransactionPdfObj = render.transaction({
  	  	  		  	 			 entityId:salesorderInternalid,
  	  	  		  	 			 printMode:render.PrintMode.PDF
  	  	  		  	 		  });
  	  	  		  	 		  
  	  	  		  	 		 //Email PDF object to recipient 
  	  	  		  	 		 email.send({
  	  	  		  	 			author:22085,
  	  	  		  	 			recipients: 'ameka@470claims.com',
  	  	  		  	 			subject:'Claim: '+documentnumber+'-NGLS-IA Adjuster Acknowledgement',
  	  	  		  	 			body:'Claim Number: '+documentnumber+'\n\n IA Adjuster acknowledgement attached to this message.\n\n\n Thank you,\n\nFourseventy Claims',
  	  	  		  	 			replyTo: 'no-reply@470.com',
  	  	  		  	 			attachments:[TransactionPdfObj]
  	  	  		  	 		 });
  		              }
  		            }
  		          // }
	    	 }	
	    	 }*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  		           
	    			
	       
	       
	       
	       
	       
	      
	 //////////////////////////////////////////////////////
 