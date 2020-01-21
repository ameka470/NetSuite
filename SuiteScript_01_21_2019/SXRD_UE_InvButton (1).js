/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
/**
 * Script Type          : USER EVENT Script
 * Script Name          : SXRD_UE_InvButton.js
 * Version              : 2.0
 * Author               : T.G.Mounika
 * Start Date           : 01/12/2017
 * Last Modified Date   : 05/12/2017
 * Description          : On creation of Customer Payment,Bill Payment,Customer Refund,Item Receipt,Cash Refund,Vendor Return Authorization,Creditmemo,Itemfulfillment,Bill credit,Returnauthorization populates the corresponding salesorder number in custom field 'custbody_sxrd__created_from'.  
 */ 
define(['N/ui/serverWidget','N/log','N/record','N/search','N/runtime'],

function(serverWidget,log,record,search,runtime) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {
    	try{
    	var recordObj=scriptContext.form;
    	var objRecord=scriptContext.newRecord;
    	var recordType = objRecord.type;
		//log.debug("recordType: ",recordType);
		if (runtime.executionContext === runtime.ContextType.USEREVENT || runtime.executionContext === runtime.ContextType.USER_INTERFACE || runtime.executionContext === runtime.ContextType.WEBSTORE || runtime.executionContext === runtime.ContextType.WEBAPPLICATION || runtime.executionContext === runtime.ContextType.WEBSERVICES || runtime.executionContext === runtime.ContextType.CSV_IMPORT || runtime.executionContext === runtime.ContextType.SUITELET || runtime.executionContext === runtime.ContextType.SCHEDULED){
			//log.debug("type:",runtime.executionContext);
		if( scriptContext.type == 'view' && recordType == 'salesorder'){	//creates 'Invoice/bill' button on salesorder in view mode
        	var InvoiceButton = recordObj.addButton
        	({
        	    id : 'custpage_invbutton',
        	    label : 'Create Invoice/Bill',
        	    functionName : "createinvorbill"
        	});
        	recordObj.removeButton({
                id :'billremaining'
               });
      		recordObj.removeButton({
  	               id :'process'
  	              });
      		recordObj.removeButton({
  	               id :'createdeposit'
  	              });
      		recordObj.removeButton({
  		           id :'nextbill'
  		              });

        	}   
    	recordObj.clientScriptFileId =1764;//'SuiteScripts/SXRD_CS_InvButton.js';// 303;
    }
    	}	
    catch(error){
    	log.debug("Error:",error);
    }
    }
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {
    	try{
    	var objRecord=scriptContext.newRecord;
    	var recordType = objRecord.type;
		log.debug("recordType: ",recordType);		//Sets the corresponding salesorder document number in the custom field
    	if(recordType == 'customerpayment' || recordType == 'vendorpayment' || recordType == 'customerrefund'){

			var numOfLines = objRecord.getLineCount({
				sublistId: 'apply'
			});
			//log.debug("numOfLines: ",numOfLines);

			for(var i=0; i < numOfLines; i++){

				var applyValue = objRecord.getSublistValue({
					sublistId: 'apply',
					fieldId: 'apply',
					line: i
				});
				//log.debug("applyValue: ",applyValue);
				if(applyValue == true){
					var refNum = objRecord.getSublistValue({
						sublistId: 'apply',
						fieldId: 'internalid',
						line: i
					});
					//log.debug("refNum: ",refNum);
					if(recordType == 'vendorpayment'){		//If record type is 'vendor payment',gets the salesorder number from 'Bill' record,and set it in custom "Created from" field

						var billNum = search.lookupFields({
							type: search.Type.VENDOR_BILL,
							id: refNum,
							columns: ['custbody_sxrd__created_from']
						});
						//log.debug("billNum: ",billNum);
						var billId = billNum.custbody_sxrd__created_from;
						//log.debug("billId: ",billId);
						var billIdValue = billId[0].value;
						//log.debug("billIdValue: ",billIdValue);
						objRecord.setValue({
							fieldId: 'custbody_sxrd__created_from',
							value: billIdValue
						});
					}else if(recordType == 'customerrefund'){	//If record type is 'Customer Refund',gets the salesorder number from 'Credit Memo' record,and set it in custom "Created from" field
						
						var creditMemoInternalId =  objRecord.getSublistValue({
							sublistId: 'apply',
							fieldId: 'internalid',
							line: i
						});
						//log.debug("creditMemoInternalId: ",creditMemoInternalId);
						
						var creditMemoLookUpField = search.lookupFields({
							type: search.Type.CREDIT_MEMO,
							id: creditMemoInternalId,
							columns: ['custbody_sxrd__created_from']
						});
						//log.debug("creditMemoLookUpField: ",creditMemoLookUpField);
						var soTranId = creditMemoLookUpField.custbody_sxrd__created_from;
						//log.debug("soTranId: ",soTranId);
						var soTranIdValue = soTranId[0].value;
						//log.debug("soTranIdValue: ",soTranIdValue);
						objRecord.setValue({
							fieldId: 'custbody_sxrd__created_from',
							value: soTranIdValue
						});
						
					}else{			//If record type is 'Customer Payment',gets the salesorder number from 'Invoice' record,and set it in custom "Created from" field
						var billNum = search.lookupFields({
							type: search.Type.INVOICE,
							id: refNum,
							columns: ['createdfrom']
						});
						//log.debug("billNum: ",billNum);
						var billId = billNum.createdfrom;
						//log.debug("billId: ",billId);
						var billIdValue = billId[0].value;
						//log.debug("billIdValue: ",billIdValue);
						objRecord.setValue({
							fieldId: 'custbody_sxrd__created_from',
							value: billIdValue
						});

					}
				}
			}
		}else if(recordType == 'itemreceipt' || recordType == 'cashrefund' || recordType == 'vendorreturnauthorization'){

			var createdFromId = objRecord.getValue({
				fieldId: 'createdfrom'
			});
			//log.debug("createdFromId: ",createdFromId);

			var createdFrom = objRecord.getText({
				fieldId: 'createdfrom'
			});
			//log.debug("createdFrom: ",createdFrom);

			var checkForPo = createdFrom.match(/Purchase/); 
			//log.debug("checkForPo: ",checkForPo);
			
			var checkForBill = createdFrom.match(/Bill/); 
			//log.debug("checkForBill: ",checkForBill);
			
			var checkForcashsale = createdFrom.match(/Cash Sale/); 
			//log.debug("checkForBill: ",checkForBill);
			
			if(checkForPo == 'Purchase'){

				var soTranNum = search.lookupFields({
					type: search.Type.PURCHASE_ORDER,
					id: createdFromId,
					columns: ['custbody_sxrd__created_from']
				});
				//log.debug("soTranNum: ",soTranNum);
				var soTranId = soTranNum.custbody_sxrd__created_from;
				//log.debug("soTranId: ",soTranId);
				var soTranIdValue = soTranId[0].value;
				//log.debug("soTranIdValue: ",soTranIdValue);
				objRecord.setValue({
					fieldId: 'custbody_sxrd__created_from',
					value: soTranIdValue
				});
			}else if(checkForBill == 'Bill'){			//
				
				var soTranNum = search.lookupFields({
					type: search.Type.VENDOR_BILL,
					id: createdFromId,
					columns: ['custbody_sxrd__created_from']
				});
				//log.debug("soTranNum: ",soTranNum);
				var soTranId = soTranNum.custbody_sxrd__created_from;
				//log.debug("soTranId: ",soTranId);
				var soTranIdValue = soTranId[0].value;
				//log.debug("soTranIdValue: ",soTranIdValue);
				objRecord.setValue({
					fieldId: 'custbody_sxrd__created_from',
					value: soTranIdValue
				});
				
			}else if(checkForcashsale == 'Cash Sale'){

				var soTranNum = search.lookupFields({
					type: search.Type.CASH_SALE,
					id: createdFromId,
					columns: ['createdfrom']
				});
				//log.debug("soTranNum: ",soTranNum);
				var soTranId = soTranNum.createdfrom;
				//log.debug("soTranId: ",soTranId);
				var soTranIdValue = soTranId[0].value;
				//log.debug("soTranIdValue: ",soTranIdValue);
				objRecord.setValue({
					fieldId: 'custbody_sxrd__created_from',
					value: soTranIdValue
				});
			}else{
				var soTranNum = search.lookupFields({
					type: search.Type.RETURN_AUTHORIZATION,
					id: createdFromId,
					columns: ['custbody_sxrd__created_from']
				});
				//log.debug("soTranNum: ",soTranNum);
				var soTranId = soTranNum.custbody_sxrd__created_from;
				//log.debug("soTranId: ",soTranId);
				var soTranIdValue = soTranId[0].value;
				//log.debug("soTranIdValue: ",soTranIdValue);
				objRecord.setValue({
					fieldId: 'custbody_sxrd__created_from',
					value: soTranIdValue
				});
			}
		}else if(recordType == 'creditmemo'){		
			
			var invoiceId = objRecord.getValue({
				fieldId: 'createdfrom'
			});
			//log.debug("invoiceId: ",invoiceId);
			var createdFrom = objRecord.getText({
				fieldId: 'createdfrom'
			});
			//log.debug("createdFrom: ",createdFrom);

			var checkForInv = createdFrom.match(/Invoice/); 
			//log.debug("checkForInv: ",checkForInv);
			if(checkForInv == 'Invoice'){		//If 'Credit Memo' is created from 'Invoice',then get the Salesorder number from invoice, and set it in custom "Created from" field.

				var soTranNum = search.lookupFields({
					type: search.Type.INVOICE,
					id: invoiceId,
					columns: ['custbody_sxrd__created_from']
				});
				//log.debug("soTranNum: ",soTranNum);
				var soTranId = soTranNum.custbody_sxrd__created_from;
				//log.debug("soTranId: ",soTranId);
				var soTranIdValue = soTranId[0].value;
				//log.debug("soTranIdValue: ",soTranIdValue);
				objRecord.setValue({
					fieldId: 'custbody_sxrd__created_from',
					value: soTranIdValue
				});
			}
			else{			//If 'Credit Memo' is created from 'Return Authorization',then get the Salesorder number from RMA, and set it in custom "Created from" field.
				var soTranNum = search.lookupFields({
				type: search.Type.RETURN_AUTHORIZATION,
				id: invoiceId,
				columns: ['custbody_sxrd__created_from']
			});
			//log.debug("soTranNum: ",soTranNum);
			var soTranId = soTranNum.custbody_sxrd__created_from;
			//log.debug("soTranId: ",soTranId);
			var soTranIdValue = soTranId[0].value;
			//log.debug("soTranIdValue: ",soTranIdValue);
			objRecord.setValue({
				fieldId: 'custbody_sxrd__created_from',
				value: soTranIdValue
			});
			}
		}else if(recordType == 'itemfulfillment' || recordType == 'vendorcredit'){

			var createdFromId = objRecord.getValue({
				fieldId: 'createdfrom'
			});
			//log.debug("createdFromId: ",createdFromId);

			var createdFrom = objRecord.getText({
				fieldId: 'createdfrom'
			});
			//log.debug("createdFrom: ",createdFrom);

			var checkForVendorRA = createdFrom.match(/Vendor Return Authorization/); 
			//log.debug("checkForVendorRA: ",checkForVendorRA);
			
			var checkForBill = createdFrom.match(/Bill/); 
			//log.debug("checkForBill: ",checkForBill);

			if(checkForVendorRA == 'Vendor Return Authorization'){		//If 'Item Fulfillment' is created from 'RMA',then get the Salesorder number from RMA, and set it in custom "Created from" field.
				//log.debug("entered if");
				var soTranNum = search.lookupFields({
					type: search.Type.RETURN_AUTHORIZATION,
					id: createdFromId,
					columns: ['custbody_sxrd__created_from']
				});
				//log.debug("soTranNum: ",soTranNum);
				var soTranId = soTranNum.custbody_sxrd__created_from;
				//log.debug("soTranId: ",soTranId);
				var soTranIdValue = soTranId[0].value;
				//log.debug("soTranIdValue: ",soTranIdValue);
				objRecord.setValue({
					fieldId: 'custbody_sxrd__created_from',
					value: soTranIdValue
				});
			}
			else{
				objRecord.setText({
					fieldId: 'custbody_sxrd__created_from',
					text: createdFrom
				});
			}
			}else if(recordType == 'returnauthorization'){
				var soRecordId = objRecord.getValue({
					fieldId: 'createdfrom'
				});
				//log.debug("soRecordId",soRecordId);
				var soRecordName = objRecord.getText({
					fieldId: 'createdfrom'
				});
				//log.debug("created from: ",soRecordName);
				var checkForInv = soRecordName.match(/Invoice/); 
				//log.debug("checkForInv: ",checkForInv);
				var checkForcashsale = soRecordName.match(/Cash Sale/); 
				//log.debug("checkForInv: ",checkForInv);
				if(checkForInv == 'Invoice'){			//If 'Customer Return Authorization' is created from 'Invoice',then get the Salesorder number from invoice, and set it in custom "Created from" field.

					var soTranNum = search.lookupFields({
						type: search.Type.INVOICE,
						id: soRecordId,
						columns: ['custbody_sxrd__created_from']
					});
					//log.debug("soTranNum: ",soTranNum);
					var soTranId = soTranNum.custbody_sxrd__created_from;
					//log.debug("soTranId: ",soTranId);
					var soTranIdValue = soTranId[0].value;
					//log.debug("soTranIdValue: ",soTranIdValue);
					objRecord.setValue({
						fieldId: 'custbody_sxrd__created_from',
						value: soTranIdValue
					});
				}
				else if(checkForcashsale == 'Cash Sale'){					//If 'Customer Return Authorization' is created from 'Cash Sale',then get the Salesorder number from cash sale, and set it in custom "Created from" field.
					/*var fromField = objRecord.getText({
						fieldId: 'custbody_sxrd__created_from'
					});
					log.debug("created from: ",soRecordId);*/
					var soTranNum = search.lookupFields({
						type: search.Type.CASH_SALE,
						id: createdFromId,
						columns: ['createdfrom']
					});
					//log.debug("soTranNum: ",soTranNum);
					var soTranId = soTranNum.createdfrom;
					//log.debug("soTranId: ",soTranId);
					var soTranIdValue = soTranId[0].value;
					//log.debug("soTranIdValue: ",soTranIdValue);
					objRecord.setValue({
						fieldId: 'custbody_sxrd__created_from',
						value: soTranIdValue
					});
				
					/*if(fromField == null || fromField == ''){
						//log.debug("not null");
						objRecord.setValue({
							fieldId: 'custbody_sxrd__created_from',
							value: soRecordId
						});
				}*/
				
				}
				else{
					//If 'Customer Return Authorization' is created from 'Claim',then get the Salesorder number from claim, and set it in custom "Created from" field.
					objRecord.setValue({
						fieldId: 'custbody_sxrd__created_from',
						value: soRecordId
					});				
				}
				
			}else if(recordType != 'salesorder'){			//If record type is other than 'Sales order',then directly get the Sales order number and set in custom 'Created From' field

			var soRecordId = objRecord.getValue({
				fieldId: 'createdfrom'
			});
			//log.debug("soRecordId: ",soRecordId);
			
			objRecord.setValue({
				fieldId: 'custbody_sxrd__created_from',
				value: soRecordId
			});
		}
    	}
    	catch(error){
    		log.debug("error",error);
    	}

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
    	
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit:beforeSubmit,
        afterSubmit:afterSubmit
    };
    
});
