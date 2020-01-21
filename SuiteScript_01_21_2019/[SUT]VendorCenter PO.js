/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/search','N/https'],

function(search,https) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	try{
    	 if (context.request.method === 'GET') {
    		 //var rec= context.currentRecord;
    	     var claim_num = context.request.parameters.claim_num;
    	     var carrier_name = context.request.parameters.carrier_name;
    	      //log.debug('claim_num'+claim_num);
    	      //log.debug('carrier_name'+carrier_name);
    	      if(claim_num!=null && claim_num!='' && (carrier_name=='' || carrier_name==null)){
    	    	  var Search_Obj = search.create({type: "salesorder",
       	    	   filters:
       	    	   [
       	    	      ["type","anyof","SalesOrd"],
       	    	      "AND",
       	    	      ["mainline","is","T"],
       	    	      "AND",
       	    	      ["numbertext","is",claim_num]//,
                    //  "AND",
                    //["name","anyof",carr_name]
       	    	   ],
       	    	   columns:
       	    	   [
       	    	      {name: "tranid"},
       	    	    {name: "entity"},
       	    	     {name: "custbody_sxrd_insured_name"},
       	    	      {name: "custbody_sxrd_invoice_gross_loss"},
       	    	      {name: "internalid"}
       	    	   ]
       	    	});
       	      //alert('salesorderSearchObj'+salesorderSearchObj);
                //log.debug('salesorderSearchObj:'+Search_Obj);
       	   var runSearch=Search_Obj.run();
       	   if(runSearch!='' && runSearch!=''){
       		var results = runSearch.getRange({start: 0, end:10});
       		if(results.length>1){
       			context.response.write('Duplicates');
       		}else{
       			var insur_name= results[0].getValue({name:'custbody_sxrd_insured_name'});
				//log.debug('insur_name:'+insur_name);
				var entity_name =  results[0].getValue({name:'entity'});
				//log.debug('entity_name:'+entity_name);
				context.response.write(''+entity_name+'&#&'+insur_name+'');
       		}
             
          }else{
        	  context.response.write('');
        	  }
          }else if(carrier_name!=null && carrier_name!='' && claim_num!=null && claim_num!=''){

	    	  var Search_Obj = search.create({type: "salesorder",
   	    	   filters:
   	    	   [
   	    	      ["type","anyof","SalesOrd"],
   	    	      "AND",
   	    	      ["mainline","is","T"],
   	    	      "AND",
   	    	      ["numbertext","is",claim_num],
                  "AND",
                ["name","anyof",carrier_name]
   	    	   ],
   	    	   columns:
   	    	   [
   	    	      {name: "tranid"},
   	    	    {name: "entity"},
   	    	     {name: "custbody_sxrd_insured_name"},
   	    	      {name: "custbody_sxrd_invoice_gross_loss"},
   	    	      {name: "internalid"}
   	    	   ]
   	    	});
   	      //alert('salesorderSearchObj'+salesorderSearchObj);
            //log.debug('salesorderSearchObj:'+Search_Obj);
   	   var runSearch=Search_Obj.run();
   	   if(runSearch!='' && runSearch!=''){
   		var results = runSearch.getRange({start: 0, end:10});
   			var insur_name= results[0].getValue({name:'custbody_sxrd_insured_name'});
			//log.debug('insur_name:'+insur_name);
			var entity_name =  results[0].getValue({name:'entity'});
			//log.debug('entity_name:'+entity_name);
			context.response.write(''+entity_name+'&#&'+insur_name+'');
   		
         
      }else{
    	  context.response.write('');
    	  }
      
        	  
          }
    	      }
    	 //}
    
    }catch(error){
	//log.debug("error:",error);
    }
    	}
	
    
    return {
        onRequest: onRequest
    };
    
});
