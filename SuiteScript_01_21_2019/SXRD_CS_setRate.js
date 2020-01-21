/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Jan 2018     TG Mounika
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function settingRate(type, name, linenum){
	try{
			
			if(name =='item'){

						//if(scriptContext.fieldId ==='item'){
					var feeScheduleId =  nlapiGetFieldValue('custbody_sxrd_fee_schedule');
					var itemGiven =  nlapiGetCurrentLineItemValue('item','item');
					//alert("itemGiven"+itemGiven);
					if(feeScheduleId){
						var customrecord=nlapiLoadRecord('customrecord_sxrd_fee_schedule', feeScheduleId)
						var itemLineCount=customrecord.getLineItemCount('recmachcustrecord_sxrd_line_item_parent');
						//alert("itemLineCount"+itemLineCount);
						for(var j=1;j<=itemLineCount;j++){
							var itemId=customrecord.getLineItemValue('recmachcustrecord_sxrd_line_item_parent','custrecord_sxrd_item_name',j);
							//alert("itemId"+itemId);
							var itemRate=customrecord.getLineItemValue('recmachcustrecord_sxrd_line_item_parent','custrecord_sxrd_line_rate',j);
	                     //alert(itemRate);
							if(itemGiven == itemId){                    
								//alert("itemGiven"+itemGiven);
	                          // alert("itemId"+itemId);
	                          // alert("itemRate"+itemRate);
                              
									setTimeout(function(){
										nlapiSetCurrentLineItemValue('item', 'rate',itemRate);
										var givenRate=nlapiGetCurrentLineItemValue('item','quantity');
										//alert("givenRate"+givenRate);
										nlapiSetCurrentLineItemValue('item', 'quantity',1);
										var quant=nlapiGetCurrentLineItemValue('item','quantity');	
										//alert(quant);
										nlapiSetCurrentLineItemValue('item', 'amount',quant*itemRate); }, 2000);
                              break;
					}
						}
		
					}
					//}
				//}
				
			
               
				
				//nlapiCommitLineItem('item');
			}
		
	}catch(err){
		nlapiLogExecution('debug','error has occured',err);
	}


}
