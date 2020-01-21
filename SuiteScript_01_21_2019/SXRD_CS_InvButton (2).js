/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/**
 * Script Type          : CLIENT Script
 * Script Name          : SXRD_CS_InvButton.js
 * Version              : 2.0
 * Author               : T.G.Mounika
 * Start Date           : 01/12/2017
 * Last Modified Date   : 05/12/2017
 * Description          :  Onclick of 'create invoice/bill' button,Creates invoice record,and triggers suitelet to create bill record.  
 */ 
define(['N/currentRecord','N/search','N/record','N/url','N/runtime'],

		function(currentRecord,search,record,url,runtime) {
	/**
     * Function to be executed after clicking 'Create invoice/bill' button.
     *
     * Gets the SalesOrder internal id,status and preferred form 
     * Based on the form preferred,Invoice or Cash sale will be created.
     * Based on environment type,triggers Suitelet, to create bill record.     
     */
	function createinvorbill()
	{
		try{
		var recObject = currentRecord.get();
		//alert("recordID"+recObject);
		var claimID =recObject.id;			//Retrieves current salesorder internal id and status
		//alert("recordID"+claimID);
		var claimStatus=recObject.getValue({
			fieldId:'status'
		});
		//alert("claimStatus"+claimStatus);
		var claimRec=record.load({			//Loads the salesorder record and retrieves adjuster name and line item values
			type: record.Type.SALES_ORDER, 
			id: claimID
		});
		var formPreferred=claimRec.getValue({
			   fieldId : 'customform'
		  });
		//alert("formPreferred "+formPreferred);
		//alert("claimStatus"+claimStatus);
        var newAdjAmtArray=new Array();	
		//var matchedIndex=new Array();
		var lineCount=claimRec.getLineCount({sublistId: 'item'});
		//alert("lineCount"+lineCount);
		for(var j=0;j<lineCount;j++){
			var check = claimRec.getSublistValue({
				sublistId: 'item',
				fieldId: 'custcol_sxrd_billed',
				line: j
			});
			if(check == false){
				var adjAmt= claimRec.getSublistValue({
				sublistId: 'item',
				fieldId: 'custcol_sxrd_adjustor_amount',
				line: j
			});
             // alert("adjAmt"+adjAmt);
				//matchedIndex.push(newAdjAmt);
			//alert("matchedIndex : "+matchedIndex);
			if(adjAmt == ""){
				var newAdjAmt= claimRec.getSublistValue({
				sublistId: 'item',
				fieldId: 'custcol_sxrd_adjustor_amount',
				line: j
			});
				//newAdjAmtArray.push(j);
              	newAdjAmtArray[newAdjAmtArray.length]=newAdjAmt;
			}
			}
		}
		//alert("matchedIndex : "+matchedIndex);
		//alert("newAdjAmtArray:"+newAdjAmtArray);
		/*for(var i=0;i< newAdjAmtArray.length;i++){
			   if(newAdjAmtArray[i] == ""){
				   matchedIndex[matchedIndex.length]=i;
			   }
			   }
		alert("matchedIndex"+matchedIndex);*/
		//alert("newAdjAmt length"+newAdjAmtArray.length);
		//alert("matchedIndex length"+matchedIndex.length);
		
		//If salesorder status is anyof pending billing,pending fulfillment,pending billing/partially fulfilled then transforms salesorder into invoice
		if(claimStatus == 'Pending Billing' || claimStatus == 'Pending Billing/Partially Fulfilled' || claimStatus == 'Pending Fulfillment'){
			//alert("entered first if");
			if(newAdjAmtArray.indexOf("") != -1 ){
				alert("Please calculate Adjuster amount");
			}
			else{
			if(formPreferred == 88){			//Creates Cash sales based on the form preferred
				//alert("entered cash sale");
				var CashSaleID = record.transform({
					fromType: record.Type.SALES_ORDER,
					fromId: claimID,
					toType: record.Type.CASH_SALE,
					isDynamic: true,
				});
				var cashSaleId=CashSaleID.save();
				//alert("cashSaleId"+cashSaleId);
			}
			else{
				//alert("entered invoice case");
			var invoiceID = record.transform({		//Creates Invoice
				fromType: record.Type.SALES_ORDER,
				fromId: claimID,
				toType: record.Type.INVOICE,
				isDynamic: true,
			});
			var invId=invoiceID.save();
			//alert("invId"+invId);
			}
             if(runtime.envType == 'SANDBOX'){							//Checks the environment type,and triggers suitelet
				var domainURL="https://system.na2.netsuite.com";
				var suiteletUrl=domainURL+url.resolveScript({
					scriptId: 'customscript_sxrd_st_invoicebutton',
					deploymentId: 'customdeploy_sxrd_st_billcreation',
					params:{soID:claimID, invID:invId}
				});
				//alert(suiteletUrl);
				window.location.href=suiteletUrl;
			}
			else if(runtime.envType == 'PRODUCTION'){
             var domainURL="https://system.na2.netsuite.com";
				var suiteletUrl=domainURL+url.resolveScript({
					scriptId: 'customscript_sxrd_st_invoicebutton',
					deploymentId: 'customdeploy_sxrd_st_billcreation',
					//returnExternalUrl: true,
					params:{soID:claimID, invID:invId}
				});
				//alert(suiteletUrl);
				window.location.href=suiteletUrl;
			} 
            }
		}
		//alert("environment:"+JSON.stringify(runtime.envType));
		if(claimStatus == 'Billed'){
			alert("Cannot create Invoice/Bill, as it is already billed");
		}
         if(claimStatus == 'Closed'){
			alert("Cannot create Invoice/Bill, as it is already closed");
		}
	}catch(error){
		log.debug("error",error);
		}
		}
	function saveRecord(scriptContext) {}
	return {
		createinvorbill:createinvorbill,
		saveRecord:saveRecord


	};

});
