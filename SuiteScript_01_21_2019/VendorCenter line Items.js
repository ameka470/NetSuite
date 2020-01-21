/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/search','N/runtime','N/url','N/https'],
//01798703
function(record,search,runtime,url,https) {

    function AddLine(scriptContext) {

    	if(scriptContext.fieldId=='custbody_fee_schedule_po'){

    		var rec= scriptContext.currentRecord;
        po_fee=rec.getText({fieldId:'custbody_fee_schedule_po'});
          //alert('po_fee'+po_fee);
    		//var  po_fee1=rec.getValue({fieldId:'custbody_fee_schedule_po'});
    		if(po_fee !=null && po_fee !=''){



    			//var rec_Id='';
    		//if(po_fee=='Review fee'){
    				rec.setText({fieldId:'custbody_fee_schedule_po_2',text:po_fee});//128 review fee
    				var rec_Id=rec.getValue({fieldId:'custbody_fee_schedule_po_2'});//128 review fee
           // alert('custbody_fee_schedule_po_2'+custbody_fee_schedule_po_2);
    				//rec_Id=128;
    			//}

    			//else
       // if(po_fee1=='Re-write Fee'){
    				//rec.setValue({fieldId:'custbody_fee_schedule_po_2',value:129});//128 review fee
    				//rec_Id=129;
    			//}
              //alert('rec_Id:'+rec_Id);
    			if(rec_Id!='' && rec_Id!=null){
    				var grossValue =  rec.getValue({
    					fieldId: 'custbody_sxrd_invoice_gross_loss'
    				});
    				if(grossValue){
    					grossValue=parseFloat(grossValue);
    					var customrecord=record.load({					//Retrieving the amount ranges from custom record and setting the amount,item values in line level
        					type: 'customrecord_sxrd_fee_schedule',
        					id: rec_Id
        				});
    					//alert('grossValue'+grossValue);
        				var lineCount=customrecord.getLineCount({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent'}); //recmachcustrecord_sxrd_fee_schedule_parent
        				//alert('lineCount'+lineCount);


        				for(var i=0;i<lineCount;i++){
        					//alert('i'+i); //for(var i=0;i<lineCount;i++){
        					var fromAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_from',line: i}); //recmachcustrecord_sxrd_fee_schedule_parent
        					fromAmount=parseFloat(fromAmount);
                         // alert('fromAmount:'+fromAmount);
        					var toAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amount',line: i}); //recmachcustrecord_sxrd_fee_schedule_parent
        					toAmount=parseFloat(toAmount);
                          //alert('toAmount:'+toAmount);
        					if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
    							var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: i}); //recmachcustrecord_sxrd_fee_schedule_parent
    							var count=rec.getLineCount({sublistId: 'item'});
    							if(count>0){
    								rec.selectLine({ sublistId: 'item', line: 0});
        			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'item', value: 254,ignoreFieldChange: true});
        			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'quantity', value: 1,ignoreFieldChange: true});
        			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'rate', value: amountpercent,ignoreFieldChange: true});
        			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'amount', value: amountpercent*1,ignoreFieldChange: true});
        			    			rec.commitLine({ sublistId: 'item'});
        							break;
    							}else{
    								rec.selectNewLine({ sublistId: 'item'});
        			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'item', value: 254,ignoreFieldChange: true});
        			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'quantity', value: 1,ignoreFieldChange: true});
        			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'rate', value: amountpercent,ignoreFieldChange: true});
        			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'amount', value: amountpercent*1,ignoreFieldChange: true});

        			    			rec.commitLine({ sublistId: 'item'});
        							break;
    							}
    							
    						}
        				}
    				}else{
    					alert('Please Enter Gross Invoice amount');
    				 //rec.setValue({fieldId: 'custbody_sxrd_invoice_gross_loss',value:''});
                      rec.setValue({fieldId:'custbody_fee_schedule_po',value:'',ignoreFieldChange:true});
                      //alert('custbody_fee_schedule_po'+custbody_fee_schedule_po);
    				}
    			}

    		//}else{
    			//rec.setValue({fieldId:'custbody_fee_schedule_po',value:''});
    		}
    	}else if(scriptContext.fieldId=='custbody_claim_num'){

    		//alert('start');
    		var rec= scriptContext.currentRecord;
    	     var claim_num = rec.getValue({fieldId :'custbody_claim_num'});
    	    
    	 //  var output_url = 'https://system.netsuite.com'+url.resolveScript({ scriptId: 'customscript_sut_ven_cen_2_0', deploymentId: 'customdeploy_sut_ven_cen_2_0_dep'});
    	 	var output_url='https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=166&deploy=1';
    	   output_url+='&claim_num='+claim_num;
    	  //alert(output_url);
    	  https.get.promise({
    		    url:output_url
    		})
    		    .then(function(response){
    		    	var output=response.body;
    		    	//alert(output);
    	    	 	if(output!='' && output!=null){
    	    	 	output=output.split('&#&');
    	    	 	
    	    	 	
    	    	 	if(output=='Duplicates'){
    	    	 		alert('Please Enter Carrier Name');
    	    	 	}else{
    	    	 		 rec.setValue({fieldId :'custbody_carrier_name_po',value:output[0],ignoreFieldChange:true});
    	    	 	 	 rec.setValue({fieldId :'custbody_sxrd_insured_name',value:output[1]});
    	    	 	}
    	    	 	
    	    	 	}
    		    })
    		    .catch(function onRejected(reason) {
    		       alert(reason);
    		    })
    	 	
    	 	
    	      
          }else if(scriptContext.fieldId=='custbody_carrier_name_po'){


      		//alert('start');
      		var rec= scriptContext.currentRecord;
      	     var claim_num = rec.getValue({fieldId :'custbody_claim_num'});
      	   var carrier_name = rec.getValue({fieldId :'custbody_carrier_name_po' });
      	    
      	 //  var output_url = 'https://system.netsuite.com'+url.resolveScript({ scriptId: 'customscript_sut_ven_cen_2_0', deploymentId: 'customdeploy_sut_ven_cen_2_0_dep'});
      	 if(carrier_name!=null && carrier_name!='' && claim_num!=null && claim_num!=''){
      		var output_url='https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=166&deploy=1';
       	   output_url+='&claim_num='+claim_num;
       	 output_url+='&carrier_name='+carrier_name;
       	  //alert(output_url);
       	  https.get.promise({
       		    url:output_url
       		})
       		    .then(function(response){
       		    	var output=response.body;
       		    	//alert(output);
       	    	 	if(output!='' && output!=null){
       	    	 	output=output.split('&#&');
	    	 	 	 rec.setValue({fieldId :'custbody_sxrd_insured_name',value:output[1]});
       	    	 	}
       		    })
       		    .catch(function onRejected(reason) {
       		       alert(reason);
       		    })
       	 	
      	 }  
          }else if(scriptContext.fieldId=='custbody_sxrd_invoice_gross_loss'){
    		
    		var rec= scriptContext.currentRecord;
    		var po_fee=rec.getValue({fieldId:'custbody_fee_schedule_po'});
    		var po_fee_2=rec.getValue({fieldId:'custbody_fee_schedule_po_2'});
    		if(po_fee!=null && po_fee!='' && po_fee_2!='' && po_fee_2!=null){
    			var rec_Id=rec.getValue({fieldId:'custbody_fee_schedule_po_2'});//128 review fee
				var grossValue =  rec.getValue({
					fieldId: 'custbody_sxrd_invoice_gross_loss'
				});
				if(grossValue){
					grossValue=parseFloat(grossValue);
					var customrecord=record.load({					//Retrieving the amount ranges from custom record and setting the amount,item values in line level
    					type: 'customrecord_sxrd_fee_schedule',
    					id: rec_Id
    				});
					//alert('grossValue'+grossValue);
    				var lineCount=customrecord.getLineCount({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent'});
    				//alert('lineCount'+lineCount);


    				for(var i=0;i<lineCount;i++){
    					//alert('i'+i); //for(var i=0;i<lineCount;i++){
    					var fromAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_from',line: i});
    					fromAmount=parseFloat(fromAmount);
    					//alert('fromAmount'+fromAmount);
    					var toAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amount',line: i});
    					toAmount=parseFloat(toAmount);
    					//alert('toAmount'+toAmount);
    					if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
							var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: i});
							var count=rec.getLineCount({sublistId: 'item'});
							if(count>0){
								rec.selectLine({ sublistId: 'item', line: 0});
    			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'item', value: 254,ignoreFieldChange: true});
    			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'quantity', value: 1,ignoreFieldChange: true});
    			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'rate', value: amountpercent,ignoreFieldChange: true});
    			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'amount', value: amountpercent*1,ignoreFieldChange: true});

    			    			rec.commitLine({ sublistId: 'item'});
    							break;
							}else{
								rec.selectNewLine({ sublistId: 'item'});
    			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'item', value: 254,ignoreFieldChange: true});
    			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'quantity', value: 1,ignoreFieldChange: true});
    			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'rate', value: amountpercent,ignoreFieldChange: true});
    			    			rec.setCurrentSublistValue({ sublistId: 'item',fieldId: 'amount', value: amountpercent*1,ignoreFieldChange: true});

    			    			rec.commitLine({ sublistId: 'item'});
    							break;
							}
						}
    				}
				}else{
					alert('Please Enter Gross Invoice amount');
				 //rec.setValue({fieldId: 'custbody_sxrd_invoice_gross_loss',value:''});
                  rec.setText({fieldId:'custbody_fee_schedule_po',value:''});
                  //alert('custbody_fee_schedule_po'+custbody_fee_schedule_po);
				}
			
    		}
    		
    	}
    }

   
   




    return {

        fieldChanged: AddLine,

    };

});
