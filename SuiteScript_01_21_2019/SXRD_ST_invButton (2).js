/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * Script Type          : SUITELET Script
 * Script Name          : SXRD_ST_invButton.js
 * Version              : 2.0
 * Author               : T.G.Mounika
 * Start Date           : 05/12/2017
 * Last Modified Date   : 05/12/2017
 * Description          : Onclick of 'create invoice/bill' button on sales order,triggers this suitelet and creates bill record.  
 */ 
define(['N/record', 'N/search','N/redirect'],
		/**
		 * @param {record} record
		 * @param {search} search
		 */
		function(record, search,redirect) {

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
		log.debug("triggereed");
		var itemName = new Array();
		var itemQuantity = new Array();
		var itemRate = new Array();
		var itemAmount = new Array();
		var itemArray=new Array();
		var itemAdjusterAmount = new Array();
		var recordID=context.request.parameters.soID;	//Gets the salesorder id from url
		log.debug("recordID",recordID);
          var invoiceNo = context.request.parameters.invID;
		
		var invRef = search.lookupFields({              // Search for Invoice Number
		    type: search.Type.INVOICE,
		    id: invoiceNo,
		    columns: ['tranid','entity']
		});
		var refNumber = invRef.tranid;
		log.debug("refNumber ",refNumber);
        var invEntity = invRef.entity;
        log.debug("invEntity ",invEntity);
		var redirection=redirect.toRecord({			//Redirects to the current salesorder record
			type : record.Type.SALES_ORDER, 
			id : recordID
		});
		var salesOrder=record.load({			//Loads the salesorder record and retrieves adjuster name and line item values
			type: record.Type.SALES_ORDER, 
			id: recordID
		});
		var docNum=salesOrder.getValue({
			fieldId:'tranid'
		});
		//log.debug("docNum",docNum);
		var vendor=salesOrder.getValue({
			fieldId:'custbody_sxrd_adjuster'
		});
          var insuredName=salesOrder.getValue({
			fieldId:'custbody_sxrd_insured_name'
		});
		var lineCount = salesOrder.getLineCount({
			sublistId: 'item'
		});
		//log.debug("lineCount: ",lineCount);
		for(var i=0;i<lineCount;i++){
			//log.debug("line num : ",i);
			itemName[i] = salesOrder.getSublistValue({
				sublistId: 'item',
				fieldId: 'item',
				line: i
			});
			//log.debug("itemName:",itemName);
			itemQuantity[i] = salesOrder.getSublistValue({
				sublistId: 'item',
				fieldId: 'quantity',
				line: i
			});
			//log.debug("itemQuantity: ",itemQuantity[i]);
			itemRate[i] = salesOrder.getSublistValue({
				sublistId: 'item',
				fieldId: 'rate',
				line: i
			});
			//log.debug("itemRate: ",itemRate[i]);
			itemAmount[i]= salesOrder.getSublistValue({
				sublistId: 'item',
				fieldId: 'amount',
				line: i
			});
			itemAdjusterAmount[i]= salesOrder.getSublistValue({
				sublistId: 'item',
				fieldId: 'custcol_sxrd_adjustor_amount',
				line: i
			});
			//log.debug("itemAdjusterAmount",itemAdjusterAmount);
		}
		var billRecord= record.create({				//Creates bill record with the items not already billed for particular salesorder
			type: record.Type.VENDOR_BILL
		});
		//log.debug("billRecord",billRecord);
          billRecord.setValue({fieldId:'tranid',value:refNumber}); // Set Invoice number as Vendor Bill "refNumber"
		//log.debug("billRecord",billRecord);
		billRecord.setValue({fieldId:'custbody_carrier_name_po',value:invEntity[0].value});
		billRecord.setValue({fieldId:'entity',value:vendor});
        billRecord.setValue({fieldId:'custbody_sxrd_insured_name',value:insuredName});
		billRecord.setValue({
			fieldId: 'custbody_sxrd__created_from',
			value: recordID
		});
		var newItemArray = new Array();
		var newAdjAmtArray = new Array();
		for(var j=0;j<lineCount;j++){
			//log.debug("line num : ",i);
			var check = salesOrder.getSublistValue({
				sublistId: 'item',
				fieldId: 'custcol_sxrd_billed',
				line: j
			});
			var adjAmt = salesOrder.getSublistValue({
				sublistId: 'item',
				fieldId: 'custcol_sxrd_adjustor_amount',
				line: j
			});
			//log.debug("adjAmt : ",adjAmt);
			if(check == false && adjAmt != 0){
				//log.debug("j",j);
				//log.debug("entered check");
				var itemsAdd=salesOrder.getSublistValue({
					sublistId: 'item',
					fieldId: 'item',
					line: j
				});
				newItemArray.push(itemsAdd);
				//log.debug("newItemArray",newItemArray);
				var newAdjAmt=salesOrder.getSublistValue({
					sublistId: 'item',
					fieldId: 'custcol_sxrd_adjustor_amount',
					line: j
				});
				newAdjAmtArray.push(newAdjAmt);
				//log.debug("newAdjAmtArray",newAdjAmtArray);
			}
		}
		/*var items = new Array();
		var itemSearch=search.load({id:'customsearch_sxrd_items_supported_for_po'});
		var itemFilter = search.createFilter({
			name: 'internalid',
			operator: 'anyof',
			values: newItemArray
		});
		//log.debug("itemFilter",itemFilter);
		itemSearch.filters.push(itemFilter);
		log.debug("itemSearch",itemSearch);
		var searchResult=itemSearch.run().getRange({
			start:0,
			end:1000
		});*/
		/*for (var k = 0; k < searchResult.length; k++) {
			items[items.length] = searchResult[k].getValue({
				name: 'internalid'
			});
		}*/
		var name=new Array();
		var qty = new Array();
		var amt = new Array();
		var rate = new Array();
		/*var matchedIndex= new Array();
		for(var i=0;i<itemName.length;i++){
			for(var j=0;j<newItemArray.length;j++){
				if(itemName[i] === newItemArray[j]){
					 if(matchedIndex.indexOf(j) == -1){
					matchedIndex[matchedIndex.length]=j;
					 }
				}
			}
		}
		log.debug("matchedIndex",matchedIndex);*/
		for(var set=0; set<newItemArray.length; set++){
			name[name.length]=itemName[itemName.indexOf(newItemArray[set])];
			qty[qty.length] = itemQuantity[itemName.indexOf(newItemArray[set])];
			rate[rate.length] =newAdjAmtArray[set];//itemAdjusterAmount[itemName.indexOf(newItemArray[set])];
			amt[amt.length] = parseFloat(parseFloat(itemQuantity[itemName.indexOf(newItemArray[set])])*parseFloat(itemAdjusterAmount[itemName.indexOf(newItemArray[set])]));
		}
		//log.debug("name",name);
		//log.debug("qty",qty);
		//log.debug("rate",rate);
		//log.debug("amt",amt);
		
		if(rate.indexOf("") == -1 ){
		for(var itr=0; itr<newItemArray.length; itr++){
			billRecord.setSublistValue({
				sublistId: 'item',
				fieldId: 'item',
				line:itr,
				value:name[itr]
			});
			billRecord.setSublistValue({
				sublistId: 'item',
				fieldId: 'quantity',
				line: itr,
				value:qty[itr]
			});
			billRecord.setSublistValue({
				sublistId: 'item',
				fieldId: 'rate',
				line: itr,
				value:parseFloat(rate[itr])/parseFloat(qty[itr])
			});
			billRecord.setSublistValue({
				sublistId: 'item',
				fieldId: 'amount',
				line:itr,
				value: rate[itr]
			});
		}
		
			var billRecordID=billRecord.save({
				enableSourcing: true,
				ignoreMandatoryFields: true
			});		
			//log.debug('billRecordID:',billRecordID);
		}
		var claimRec=record.load({			//Loads the salesorder record and set the 'Billed','Closed' values to true.
			type: record.Type.SALES_ORDER, 
			id: recordID
		});
		var lineCount = claimRec.getLineCount({
			sublistId: 'item'
		});
		//log.debug("lineCount: ",lineCount);
		for(var i=0;i<lineCount;i++){
			//log.debug("line num : ",i);
			 claimRec.setSublistValue({
				sublistId: 'item',
				fieldId: 'custcol_sxrd_billed',
				line: i,
				value:true
			});
			 claimRec.setSublistValue({
					sublistId: 'item',
					fieldId: 'isclosed',
					line: i,
					value:true
				});
			//log.debug("check:",check);
		}
		claimRec.save();
		
		

		}catch(error){
			log.debug("error:",error);
		}

	}

	return {
		onRequest: onRequest
	};

});
