/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/ui/serverWidget', 'N/format', 'N/https', 'N/record', 'N/error','N/url', 'N/runtime'],

function(search, ui, format, https, record, error,url, runtime) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	try {

    		if (context.request.method === 'GET') {
    		var tran_id=context.request.parameters.doc_id;
    		if(tran_id!='' && tran_id!=null){
    		getSalesOrder(context,tran_id);

    		}else{
    		showForm(context);
    		}
    		} else {
    		showResults(context);
    		}
    		} catch (e) {
    		log.debug('onRequest_error', 'ERROR : ' + e.message);
    		  log.debug('ERROR', 'ERROR : ' + e);
    		  context.response.write('<p>Invoice not billed or Claim # not found. Please check with administrator.</p>');
    		}
    }
    
    		function showForm(context) {
    			var form = ui.createForm({ title : 'Request for Invoice'});
    			var req = context.request;
    			var soSearch = form.addField({id : 'custpage_tranid',type : ui.FieldType.TEXT,label : 'Claim# SEARCH'});
    			//var carrierSearch = form.addField({id : 'custpage_carrier',type : ui.FieldType.SELECT,label : 'Carrier SEARCH', source : 'customer'});
    			soSearch.isMandatory = true;
    			//carrierSearch.isMandatory = true;
    			form.addSubmitButton({ label : 'Search'});


    			context.response.writePage(form);
    			} 	
    		function getSalesOrder(context,tran_id){
    			var userObj = runtime.getCurrentUser();
        		log.debug('userObj'+userObj);
        		var currentAdjsterId = userObj.id;
        		log.debug('Internal ID of current user: '+currentAdjsterId);
        		 var remainingUsage = runtime.getCurrentScript().getRemainingUsage();
        		 log.debug('remainingUsage : ' +remainingUsage)
                 var userRole = runtime.getCurrentUser().role;
        		 log.debug('userRole : ' +userRole)
        		log.debug('tran_id : ' +tran_id);
        		 if(userRole == '1023' || userRole == '1009' || userRole == '1024'){
    			var so_rec=record.load({type:'salesorder',id:tran_id,isDynamic:true});
    			log.debug('so_rec : ' +so_rec);

    			var form = ui.createForm({title : 'Claim #' + so_rec.getValue({fieldId:'tranid'})});
    			///SO#
    			var so = form.addField({id : 'custpage_tranid',type : ui.FieldType.TEXT,label : 'Claim #'});
    			so.defaultValue=so_rec.getValue({fieldId:'tranid'});
    			so.updateDisplayType({ displayType:'DISABLED'});
    			///Customer
    			var cus = form.addField({id: 'custpage_customer', label: 'Customer', source : 'customer',type : 'select'});/*, source : 'customer'*/
    			cus.defaultValue=so_rec.getValue({fieldId:'entity'});
    			cus.updateDisplayType({ displayType:'DISABLED'});
    			var insured = form.addField({id: 'custpage_adjuster', label: 'Insured Person',type : 'text'});
    			insured.defaultValue=so_rec.getValue({fieldId:'custbody_sxrd_insured_name'});
    			insured.updateDisplayType({ displayType:'DISABLED'}); 
    			////Fee Schedule
    			//var feeschedule = form.addField({id: 'custpage_feeschedule', label: 'Fee Schedule',type : 'select', source : 'customrecord_sxrd_fee_schedule'});
    			//feeschedule.defaultValue=so_rec.getValue({fieldId:'customrecord_sxrd_fee_schedule'});
    			//feeschedule.updateDisplayType({ displayType:'DISABLED'});
    			////Invoice Gross Loss
    			//var invoice_grossloss = form.addField({id: 'custpage_inv_gossloss', label: 'InvoiceGrossLoss',type : 'integer'});
    			//invoice_grossloss.defaultValue=so_rec.getValue({fieldId:'custbody_sxrd_invoice_gross_loss'});
    			//invoice_grossloss.updateDisplayType({ displayType:'DISABLED'});
    			var so_id= form.addField({id : 'custpage_so_id',type : ui.FieldType.TEXT,label : 'Claim #'});
    			so_id.defaultValue=tran_id;
    			so_id.updateDisplayType({ displayType:'HIDDEN'});
    		
    			
    			var invoiceSublist = form.addSublist({id : 'custpage_invoice', type : ui.SublistType.INLINEEDITOR,  label : 'Invoice(s)' });
    			//itemSublist.addField({id : 'custpage_isclosed',label : 'IsClosed',type : 'checkbox',source:'item'});
    			//itemSublist.addField({id : 'custpage_item',label : 'Item',type : 'select',source:'item'});
    			invoiceSublist.addField({id : 'custpage_invoiceid',label : 'Invoice #',type : 'TEXT'});
    			
    			invoiceSublist.addField({id : 'custpage__fee_schedule',label : 'Fee Schedule',type : 'select',source:'customrecord_sxrd_fee_schedule'});
    			invoiceSublist.addField({id : 'custpage_invoice_grossloss',label : 'Invoice GrossLoss',type : 'TEXT' });
    			//itemSublist.addField({id : 'custpage_full_commision',label : 'Full Commission',type : 'checkbox' });
   
    			invoiceSublist.addField({id : 'custpage_amount',label : 'Amount',type : 'currency'});
    			//invoiceSublist.addField({id : 'custpage_invoiceid',label : 'Invoice #',type : 'TEXT'});
    			//itemSublist.addField({id : 'custpage_isbilled',label : 'IsBilled',type : 'checkbox'});
    			
    			var invoiceDetailsSublist = form.addSublist({id : 'custpage_invoice_details', type : ui.SublistType.INLINEEDITOR,  label : 'InvoiceLineItems(s)' });
    			invoiceDetailsSublist.addField({id : 'custpage_invoiceid_details',label : 'Invoice #',type : 'TEXT'});
    			invoiceDetailsSublist.addField({id : 'custpage_item',label : 'Item',type : 'select',source:'item'});
    			invoiceDetailsSublist.addField({id : 'custpage_description',label : 'Description',type : 'TEXT'});
    			//invoiceSublist.addField({id : 'custpage_invoice_grossloss',label : 'Invoice GrossLoss',type : 'TEXT' });
    			invoiceDetailsSublist.addField({id : 'custpage_quantity',label : 'Quantity',type : 'float' });
    			//invoiceSublist.addField({id : 'custpage__fee_schedule',label : 'Fee Schedule',type : 'select',source:'customrecord_sxrd_fee_schedule'});
    			invoiceDetailsSublist.addField({id : 'custpage_amount',label : 'Amount',type : 'currency'});
    			invoiceDetailsSublist.addField({id : 'custpage_taxamount',label : 'Tax Amount',type : 'currency'});
    			invoiceDetailsSublist.addField({id : 'custpage_adjuster_amount',label : 'Adjuster Amount',type : 'currency'});
    			
    			 
		        	var numLinesMainTab = invoiceSublist.lineCount;
		        	log.debug('numLinesMainTab'+numLinesMainTab);
		        	
    			
    			var salesorderSearchObj = search.create({
    				   type: "salesorder",
    				   filters: [["type","anyof","SalesOrd"],  
    					   "AND", ["internalidnumber","equalto",tran_id],
                            "AND", 
      ["mainline","is","F"], 
      "AND", 
      ["taxline","is","F"], 
      "AND", 
      ["cogs","is","F"]     
    					//   "AND",  ["account","anyof","236"],  //236
    					   ],
    				   columns:[search.createColumn({name: "internalid",summary: "GROUP",label: "Internal ID"}),
    					   		search.createColumn({name: "tranid",join: "applyingtransaction",summary: "GROUP",label: "Document Number" }),
    					   		search.createColumn({name: "total",join: "applyingtransaction",summary: "GROUP",label: "Amount (Transaction Total)" }),
    					   		search.createColumn({name: "custbody_sxrd_invoice_gross_loss",join: "applyingTransaction",summary: "MAX",label: "Invoice Gross Loss"}),
    					        search.createColumn({name: "formulatext",summary: "MAX",formula: "{applyingtransaction.custbody_sxrd_fee_schedule.id}",label: "Fee Schedule" }),
    					        search.createColumn({name: "internalid",join: "applyingTransaction",summary: "GROUP",label: "Internal ID"}),
    					        search.createColumn({name: "custbody_sxrd_insured_name",summary: "MAX", label: "Insured Name"}),
    					        search.createColumn({name: "entity",summary: "MAX", label: "Name"})
    					         ]
    				   });
    			var runSearch=salesorderSearchObj.run();
    			if(runSearch!=null && runSearch!=''){
    			var results=runSearch.getRange({start: 0,end: 999});
    			if(results.length>0){
    			log.debug('numLinesMainTab'+numLinesMainTab);
    				 for(var i=0; results.length != null && i<results.length;i++){
    					 
    					 log.debug('results',results);
    					 log.debug('i',i);
    		        	 var claimID = results[i].getValue({name:"internalid",summary: "GROUP"});//,summaary: "GROUP"
    		        	 log.debug('claimID'+claimID);
    		        	 var invoiceID= results[i].getValue({name:"tranid",join: "applyingtransaction",summary: "GROUP"});
    		        	 log.debug('invoiceID'+invoiceID);
    		        	 
    		        	 var invoiceIntenalID= results[i].getValue({name:"internalid",join: "applyingtransaction",summary: "GROUP"});
    		        	 log.debug('invoiceIntenalID'+invoiceIntenalID);
    		        	 if(invoiceIntenalID ==''|| invoiceIntenalID == 'null'){
    		        		 log.debug('InvoiceInternalid is null'+carierName)
    		        	 }else{
    		        	 var carierName =results[i].getValue({name:"entity",summary: "MAX"});
    		        	 log.debug('carierName'+carierName);
    		        	 var fields = ['tranid', 'custbody_sxrd_adjuster', 'entity']
    		        	 var invoiceAdjuster = search.lookupFields({type: search.Type.INVOICE,id: invoiceIntenalID,columns: fields});
    		      //  	 log.debug('invoiceAdjuster'+invoiceAdjuster);
    		        	 var invoiceAdjusterId1 = invoiceAdjuster.tranid;
    		        	
    		     	 	 var invoiceAdjusterId = invoiceAdjuster.custbody_sxrd_adjuster[0].value;
    		        	 log.debug('invoiceAdjusterId'+invoiceAdjusterId);
    		      //  	 log.debug('invoiceAdjusterId1'+invoiceAdjusterId1);
    		        	// if(currentAdjsterId == invoiceAdjusterId){
    		        		 
    		        		 
    		        	 var invoiceAmount = results[i].getValue({name: "total",join: "applyingtransaction",summary: "GROUP"});
    		        	 log.debug('invoiceAmount'+invoiceAmount);
    		        	 var invoiceGrossLoss = results[i].getValue({name: "custbody_sxrd_invoice_gross_loss",join: "applyingtransaction",summary: "MAX"});
    		        	 log.debug('invoiceGrossLoss'+invoiceGrossLoss);
    		        	 var fee_schedule = results[i].getValue({name: "formulatext",summary: "MAX"});
    		        	 log.debug('fee_schedule'+fee_schedule);
    		        	 var numLinesMainTab = invoiceSublist.lineCount;
   			        	
   			        	log.debug('numLinesMainTab'+numLinesMainTab);
    		        	 if(currentAdjsterId == invoiceAdjusterId){
    		        		 
    		        	if(numLinesMainTab == -1){
    		        	 if(invoiceGrossLoss){
    		        	 invoiceSublist.setSublistValue({id: 'custpage_invoice_grossloss',line: numLinesMainTab+1,   value:invoiceGrossLoss });//line: i,
    		        	 }
    		        	 if(invoiceID){
    		        	 invoiceSublist.setSublistValue({id: 'custpage_invoiceid',line: numLinesMainTab+1,   value:invoiceID });
    		        	 }
    		        	 if(invoiceAmount){
    		        	 invoiceSublist.setSublistValue({id: 'custpage_amount',line: numLinesMainTab+1,   value:invoiceAmount });
    		        	 }
    		        	 if(fee_schedule){
    		        	 invoiceSublist.setSublistValue({id: 'custpage__fee_schedule',line: numLinesMainTab+1,   value:fee_schedule });
    		        	 }
    		        	 
    		        	 var numLines = invoiceDetailsSublist.lineCount;
		 		        	var so_item=new Array();
		 		        	log.debug('numLines'+numLines);
		 		        	var numLinesCount = invoiceDetailsSublist.lineCount;
		 		        	log.debug('numLinesCount'+numLinesCount);
 		 				var so_item=form.getSublist({id: 'custpage_invoice_details'});
		 		        	log.debug('so_item',so_item.lineCount);
		 		        	
		 		        	
    		        	 var invoiceSearchObj  = search.create({
    		 				   type: "invoice",
    		 				   filters: [["type","anyof","CustInvc"],  
    		 					   "AND", ["numbertext","is",invoiceID], 
                                         "AND", 
      ["mainline","is","F"], 
      "AND", 
      ["taxline","is","F"]
    		 					 //  "AND",  ["account","anyof","121"],  
    		 					   ],
    		 				   columns:[search.createColumn({name: "trandate", label: "Date"}),
    		 					      search.createColumn({name: "type", label: "Type"}),
    		 					      search.createColumn({name: "tranid", label: "Document Number"}),
    		 					      search.createColumn({name: "entity", label: "Name"}),
    		 					      search.createColumn({name: "account", label: "Account"}),
    		 					      search.createColumn({name: "memo", label: "Memo"}),
    		 					      search.createColumn({name: "item", label: "Item"}),
    		 					      search.createColumn({name: "quantity", label: "Quantity"}),
    		 					      search.createColumn({name: "amount", label: "Amount"}),
    		 					      search.createColumn({name: "amountpaid", label: "Amount Paid"}),
    		 					      search.createColumn({name: "custcol_sxrd_adjustor_amount", label: "Adjuster Amount"}),
    		 					      search.createColumn({name: "amountremaining", label: "Amount Remaining"}),
    		 					      search.createColumn({name: "taxamount", label: "Amount (Tax)"}),
    		 					      search.createColumn({name: "custbody_sxrd_adjuster", label: "Adjuster"})
    		 					   		]
    		 				   });
    		 			var runSearch1=invoiceSearchObj.run();
    		 			if(runSearch1!=null && runSearch1!=''){
    		 			var results1=runSearch1.getRange({start: 0,end: 10});
    		 			if(results1.length>0){
    		 				if(numLinesCount == -1){
    		 				 for(var j=0; results1.length != null && j<results1.length;j++){
    		 					 
    		 					// log.debug('results1',results);
    	    					 log.debug('j',j);
    	    					 
    	    					/* var adjuster = results1[j].getValue({name:"custbody_sxrd_adjuster"});//,summaary: "GROUP"
    		 		        	 log.debug('adjuster'+adjuster);
    		 		        	 if(adjuster == currentAdjsterId){*/
    	    					 var numLinesMainTabinvoiceDetailsSublist = invoiceDetailsSublist.lineCount;
    	    			        	log.debug('numLinesMainTabinvoiceDetailsSublist'+numLinesMainTabinvoiceDetailsSublist);
    	    			        	
    		 		        	 var invoiceID = results1[j].getValue({name:"tranid"});//,summaary: "GROUP"
    		 		        	 log.debug('invoiceID'+invoiceID);
    		 		        	 var item_description =  results1[j].getValue({name:"memo"});
    		 		        	 log.debug('item_description'+item_description);
    		 		        	 var item_value= results1[j].getValue({name:"item"});
    		 		        	 log.debug('item_value'+item_value);
    		 		        	 var item_quantity= results1[j].getValue({name:"quantity"});
    		 		        	 log.debug('item_quantity'+item_quantity);
    		 		        	 var invoiceAmount = results1[j].getValue({name: "amount"});
    		 		        	 log.debug('invoiceAmount'+invoiceAmount);
    		 		        	 var adjusterAmount = results1[j].getValue({name: "custcol_sxrd_adjustor_amount"});
    		 		        	 log.debug('adjusterAmount'+adjusterAmount);
    		 		        	 var item_tax_amount = results1[j].getValue({name: "taxamount"});
    		 		        	log.debug('enterd line items1');
    		 		        	 log.debug('item_tax_amount'+item_tax_amount);
    		 		        	log.debug('enterd line items1');
    		 		        	
    		 				 
        		        	 if(invoiceID){
    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_invoiceid_details',line: j,   value:invoiceID });
    		 		        		log.debug('enterd line items2');
    		 				 }
        		        	 if(item_description){
    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_description',line: j,   value:item_description });
        		        	 }
        		         if(item_value){
    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_item',line: j,   value:item_value });
        		        	 }
        		        	 if(item_quantity){
    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_quantity',line: j,   value:item_quantity });
        		        	 }
        		        	 if(invoiceAmount){
    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_amount',line: j,   value:invoiceAmount });
        		        	 }
        		        	 if(adjusterAmount){
    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_adjuster_amount',line: j,   value:adjusterAmount });
        		        	 }
        		        	 if(item_tax_amount){
    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_taxamount',line: j,   value:item_tax_amount }); 
        		        	 }
        		        	 log.debug('enterd line items3');
        		 		        	
    		 		        	
    		 				 }
    		 				}else{
    		 					log.debug('logic worked');
   		 					 for(var j=0; results1.length != null && j<results1.length;j++){
       		 					 
       		 					// log.debug('results1',results);
       	    					 log.debug('j',j);
       	    					 
       	    				/*	 var adjuster = results1[j].getValue({name:"custbody_sxrd_adjuster"});//,summaary: "GROUP"
       		 		        	 log.debug('adjuster'+adjuster);
       		 		        	 if(adjuster == currentAdjsterId){*/
       	    					 
       		 		        	 var invoiceID = results1[j].getValue({name:"tranid"});//,summaary: "GROUP"
       		 		        //	 log.debug('invoiceID'+invoiceID);
       		 		        	 var item_description =  results1[j].getValue({name:"memo"});
       		 		        //	 log.debug('item_description'+item_description);
       		 		        	 var item_value= results1[j].getValue({name:"item"});
       		 		        //	 log.debug('item_value'+item_value);
       		 		        	 var item_quantity= results1[j].getValue({name:"quantity"});
       		 		       // 	 log.debug('item_quantity'+item_quantity);
       		 		        	 var invoiceAmount = results1[j].getValue({name: "amount"});
       		 		      //  	 log.debug('invoiceAmount'+invoiceAmount);
       		 		        	 var adjusterAmount = results1[j].getValue({name: "custcol_sxrd_adjustor_amount"});
       		 		     //   	 log.debug('adjusterAmount'+adjusterAmount);
       		 		        	 var item_tax_amount = results1[j].getValue({name: "taxamount"});
       		 		     //   	 log.debug('item_tax_amount'+item_tax_amount);
   		 					
           		        	 if(invoiceID){
       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_invoiceid_details',line: numLinesCount+j,   value:invoiceID });
           		        	 }
           		        	 if(item_description){
       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_description',line: numLinesCount+j,   value:item_description });
           		        	 }
           		        	 if(item_value){
       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_item',line: numLinesCount+j,   value:item_value });
           		        	 }
           		        	 if(item_quantity){
       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_quantity',line: numLinesCount+j,   value:item_quantity });
           		        	 }
           		        	 if(invoiceAmount){
       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_amount',line: numLinesCount+j,   value:invoiceAmount });
           		        	 }
           		        	 if(adjusterAmount){
       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_adjuster_amount',line: numLinesCount+j,   value:adjusterAmount });
           		        	 }
           		        	 if(item_tax_amount){
       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_taxamount',line: numLinesCount+j,   value:item_tax_amount }); 
           		        	 }
    		 					}
    		 				}
    		 				}
    		 			}
    		        	 }else{

    		        		 
    	    		        	//if(i == numLinesMainTab){
    	    		        	 if(invoiceGrossLoss){
    	    		        	 invoiceSublist.setSublistValue({id: 'custpage_invoice_grossloss',line: numLinesMainTab,   value:invoiceGrossLoss });//line: i,
    	    		        	 }
    	    		        	 if(invoiceID){
    	    		        	 invoiceSublist.setSublistValue({id: 'custpage_invoiceid',line: numLinesMainTab,   value:invoiceID });
    	    		        	 }
    	    		        	 if(invoiceAmount){
    	    		        	 invoiceSublist.setSublistValue({id: 'custpage_amount',line: numLinesMainTab,   value:invoiceAmount });
    	    		        	 }
    	    		        	 if(fee_schedule){
    	    		        	 invoiceSublist.setSublistValue({id: 'custpage__fee_schedule',line: numLinesMainTab,   value:fee_schedule });
    	    		        	 }
    	    		        	 
    	    		        	 var numLines = invoiceDetailsSublist.lineCount;
    			 		        	var so_item=new Array();
    			 		        //	log.debug('numLines'+numLines);
    			 		        	var numLinesCount = invoiceDetailsSublist.lineCount;
    			 		       // 	log.debug('numLinesCount'+numLinesCount);
    	 		 				var so_item=form.getSublist({id: 'custpage_invoice_details'});
    			 		        	log.debug('so_item',so_item.lineCount);
    			 		        	
    			 		        	
    	    		        	 var invoiceSearchObj  = search.create({
    	    		 				   type: "invoice",
    	    		 				   filters: [["type","anyof","CustInvc"],  
    	    		 					   "AND", ["numbertext","is",invoiceID], 
                                                 "AND", 
      ["mainline","is","F"], 
      "AND", 
      ["taxline","is","F"]
    	    		 					 //  "AND",  ["account","anyof","121"],  
    	    		 					   ],
    	    		 				   columns:[search.createColumn({name: "trandate", label: "Date"}),
    	    		 					      search.createColumn({name: "type", label: "Type"}),
    	    		 					      search.createColumn({name: "tranid", label: "Document Number"}),
    	    		 					      search.createColumn({name: "entity", label: "Name"}),
    	    		 					      search.createColumn({name: "account", label: "Account"}),
    	    		 					      search.createColumn({name: "memo", label: "Memo"}),
    	    		 					      search.createColumn({name: "item", label: "Item"}),
    	    		 					      search.createColumn({name: "quantity", label: "Quantity"}),
    	    		 					      search.createColumn({name: "amount", label: "Amount"}),
    	    		 					      search.createColumn({name: "amountpaid", label: "Amount Paid"}),
    	    		 					      search.createColumn({name: "custcol_sxrd_adjustor_amount", label: "Adjuster Amount"}),
    	    		 					      search.createColumn({name: "amountremaining", label: "Amount Remaining"}),
    	    		 					      search.createColumn({name: "taxamount", label: "Amount (Tax)"}),
    	    		 					      search.createColumn({name: "custbody_sxrd_adjuster", label: "Adjuster"})
    	    		 					   		]
    	    		 				   });
    	    		 			var runSearch1=invoiceSearchObj.run();
    	    		 			if(runSearch1!=null && runSearch1!=''){
    	    		 			var results1=runSearch1.getRange({start: 0,end: 10});
    	    		 			if(results1.length>0){
    	    		 				if(numLinesCount == -1){
    	    		 				 for(var j=0; results1.length != null && j<results1.length;j++){
    	    		 					 
    	    		 					
    	    	    				//	 log.debug('j',j);
    	    	    					 
    	    	    					/* var adjuster = results1[j].getValue({name:"custbody_sxrd_adjuster"});//,summaary: "GROUP"
    	    		 		        	 log.debug('adjuster'+adjuster);
    	    		 		        	 if(adjuster == currentAdjsterId){*/
    	    	    					 var numLinesMainTabinvoiceDetailsSublist = invoiceDetailsSublist.lineCount;
    	    	    			     //   	log.debug('numLinesMainTabinvoiceDetailsSublist'+numLinesMainTabinvoiceDetailsSublist);
    	    	    			        	
    	    		 		        	 var invoiceID = results1[j].getValue({name:"tranid"});//,summaary: "GROUP"
    	    		 		        	 log.debug('invoiceID'+invoiceID);
    	    		 		        	 var item_description =  results1[j].getValue({name:"memo"});
    	    		 		      //  	 log.debug('item_description'+item_description);
    	    		 		        	 var item_value= results1[j].getValue({name:"item"});
    	    		 		      //  	 log.debug('item_value'+item_value);
    	    		 		        	 var item_quantity= results1[j].getValue({name:"quantity"});
    	    		 		      //  	 log.debug('item_quantity'+item_quantity);
    	    		 		        	 var invoiceAmount = results1[j].getValue({name: "amount"});
    	    		 		     //   	 log.debug('invoiceAmount'+invoiceAmount);
    	    		 		        	 var adjusterAmount = results1[j].getValue({name: "custcol_sxrd_adjustor_amount"});
    	    		 		     //   	 log.debug('adjusterAmount'+adjusterAmount);
    	    		 		        	 var item_tax_amount = results1[j].getValue({name: "taxamount"});
    	    		 		    //    	log.debug('enterd line items1');
    	    		 		   //    	 log.debug('item_tax_amount'+item_tax_amount);
    	    		 		   //     	log.debug('enterd line items1');
    	    		 		        	
    	    		 				 
    	        		        	 if(invoiceID){
    	    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_invoiceid_details',line: j,   value:invoiceID });
    	    		 		        	//	log.debug('enterd line items2');
    	    		 				 }
    	        		        	 if(item_description){
    	    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_description',line: j,   value:item_description });
    	        		        	 }
    	        		         if(item_value){
    	    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_item',line: j,   value:item_value });
    	        		        	 }
    	        		        	 if(item_quantity){
    	    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_quantity',line: j,   value:item_quantity });
    	        		        	 }
    	        		        	 if(invoiceAmount){
    	    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_amount',line: j,   value:invoiceAmount });
    	        		        	 }
    	        		        	 if(adjusterAmount){
    	    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_adjuster_amount',line: j,   value:adjusterAmount });
    	        		        	 }
    	        		        	 if(item_tax_amount){
    	    		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_taxamount',line: j,   value:item_tax_amount }); 
    	        		        	 }
    	        		        	 log.debug('enterd line items3');
    	        		 		        	
    	    		 		        	
    	    		 				 }
    	    		 				}else{
    	    		 		//			log.debug('logic worked');
    	   		 					 for(var j=0; results1.length != null && j<results1.length;j++){
    	       		 					 
    	       		 					// log.debug('results1',results);
    	       	    					 log.debug('j',j);
    	       	    					 
    	       	    				/*	 var adjuster = results1[j].getValue({name:"custbody_sxrd_adjuster"});//,summaary: "GROUP"
    	       		 		        	 log.debug('adjuster'+adjuster);
    	       		 		        	 if(adjuster == currentAdjsterId){*/
    	       	    					 
    	       		 		        	 var invoiceID = results1[j].getValue({name:"tranid"});//,summaary: "GROUP"
    	       		 		  //      	 log.debug('invoiceID'+invoiceID);
    	       		 		        	 var item_description =  results1[j].getValue({name:"memo"});
    	       		 		 //       	 log.debug('item_description'+item_description);
    	       		 		        	 var item_value= results1[j].getValue({name:"item"});
    	       		 		//        	 log.debug('item_value'+item_value);
    	       		 		        	 var item_quantity= results1[j].getValue({name:"quantity"});
    	       		 		//        	 log.debug('item_quantity'+item_quantity);
    	       		 		        	 var invoiceAmount = results1[j].getValue({name: "amount"});
    	       		 		//        	 log.debug('invoiceAmount'+invoiceAmount);
    	       		 		        	 var adjusterAmount = results1[j].getValue({name: "custcol_sxrd_adjustor_amount"});
    	       		 		//        	 log.debug('adjusterAmount'+adjusterAmount);
    	       		 		        	 var item_tax_amount = results1[j].getValue({name: "taxamount"});
    	       		 		//        	 log.debug('item_tax_amount'+item_tax_amount);
    	   		 					
    	           		        	 if(invoiceID){
    	       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_invoiceid_details',line: numLinesCount+j,   value:invoiceID });
    	           		        	 }
    	           		        	 if(item_description){
    	       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_description',line: numLinesCount+j,   value:item_description });
    	           		        	 }
    	           		        	 if(item_value){
    	       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_item',line: numLinesCount+j,   value:item_value });
    	           		        	 }
    	           		        	 if(item_quantity){
    	       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_quantity',line: numLinesCount+j,   value:item_quantity });
    	           		        	 }
    	           		        	 if(invoiceAmount){
    	       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_amount',line: numLinesCount+j,   value:invoiceAmount });
    	           		        	 }
    	           		        	 if(adjusterAmount){
    	       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_adjuster_amount',line: numLinesCount+j,   value:adjusterAmount });
    	           		        	 }
    	           		        	 if(item_tax_amount){
    	       		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_taxamount',line: numLinesCount+j,   value:item_tax_amount }); 
    	           		        	 }
    	    		 					}
    	    		 				}
    	    		 				}
    	    		 			}
    	    				 
    		        	 }
    		        	 }
    				 }//For If(InvoiceID)
    				}
    		        	
    			}
    			}
    			var remainingUsage = runtime.getCurrentScript().getRemainingUsage();
       //		 log.debug('remainingUsage : ' +remainingUsage)	
    		
    			form.addSubmitButton({ label : 'Search New One'});
    			context.response.writePage(form);
    		}//user role closing parenthesis
        		 else{
        			 var so_rec=record.load({type:'salesorder',id:tran_id,isDynamic:true});
         			log.debug('so_rec : ' +so_rec);

         			var form = ui.createForm({title : 'Claim #' + so_rec.getValue({fieldId:'tranid'})});
         			///SO#
         			var so = form.addField({id : 'custpage_tranid',type : ui.FieldType.TEXT,label : 'Claim #'});
         			so.defaultValue=so_rec.getValue({fieldId:'tranid'});
         			so.updateDisplayType({ displayType:'DISABLED'});
         			///Customer
         			var cus = form.addField({id: 'custpage_customer', label: 'Customer',type : 'select', source : 'customer'});
         			cus.defaultValue=so_rec.getValue({fieldId:'entity'});
         			cus.updateDisplayType({ displayType:'DISABLED'});
         			var insured = form.addField({id: 'custpage_adjuster', label: 'Insured Person',type : 'text'});
         			insured.defaultValue=so_rec.getValue({fieldId:'custbody_sxrd_insured_name'});
         			insured.updateDisplayType({ displayType:'DISABLED'}); 
         			////Fee Schedule
         			//var feeschedule = form.addField({id: 'custpage_feeschedule', label: 'Fee Schedule',type : 'select', source : 'customrecord_sxrd_fee_schedule'});
         			//feeschedule.defaultValue=so_rec.getValue({fieldId:'customrecord_sxrd_fee_schedule'});
         			//feeschedule.updateDisplayType({ displayType:'DISABLED'});
         			////Invoice Gross Loss
         			//var invoice_grossloss = form.addField({id: 'custpage_inv_gossloss', label: 'InvoiceGrossLoss',type : 'integer'});
         			//invoice_grossloss.defaultValue=so_rec.getValue({fieldId:'custbody_sxrd_invoice_gross_loss'});
         			//invoice_grossloss.updateDisplayType({ displayType:'DISABLED'});
         			var so_id= form.addField({id : 'custpage_so_id',type : ui.FieldType.TEXT,label : 'Claim #'});
         			so_id.defaultValue=tran_id;
         			so_id.updateDisplayType({ displayType:'HIDDEN'});
         			
         			var invoiceSublist = form.addSublist({id : 'custpage_invoice', type : ui.SublistType.INLINEEDITOR,  label : 'Invoice(s)' });
         			//itemSublist.addField({id : 'custpage_isclosed',label : 'IsClosed',type : 'checkbox',source:'item'});
         			//itemSublist.addField({id : 'custpage_item',label : 'Item',type : 'select',source:'item'});
         			invoiceSublist.addField({id : 'custpage_invoiceid',label : 'Invoice #',type : 'TEXT'});
         			invoiceSublist.addField({id : 'custpage__fee_schedule',label : 'Fee Schedule',type : 'select',source:'customrecord_sxrd_fee_schedule'});
         			invoiceSublist.addField({id : 'custpage_invoice_grossloss',label : 'Invoice GrossLoss',type : 'TEXT' });
         			//itemSublist.addField({id : 'custpage_full_commision',label : 'Full Commission',type : 'checkbox' });
        
         			invoiceSublist.addField({id : 'custpage_amount',label : 'Amount',type : 'currency'});
         			//invoiceSublist.addField({id : 'custpage_invoiceid',label : 'Invoice #',type : 'TEXT'});
         			//itemSublist.addField({id : 'custpage_isbilled',label : 'IsBilled',type : 'checkbox'});
         			
         			var invoiceDetailsSublist = form.addSublist({id : 'custpage_invoice_details', type : ui.SublistType.INLINEEDITOR,  label : 'InvoiceLineItems(s)' });
         			invoiceDetailsSublist.addField({id : 'custpage_invoiceid_details',label : 'Invoice #',type : 'TEXT'});
         			invoiceDetailsSublist.addField({id : 'custpage_item',label : 'Item',type : 'select',source:'item'});
         			invoiceDetailsSublist.addField({id : 'custpage_description',label : 'Description',type : 'TEXT'});
         			//invoiceSublist.addField({id : 'custpage_invoice_grossloss',label : 'Invoice GrossLoss',type : 'TEXT' });
         			invoiceDetailsSublist.addField({id : 'custpage_quantity',label : 'Quantity',type : 'float' });
         			//invoiceSublist.addField({id : 'custpage__fee_schedule',label : 'Fee Schedule',type : 'select',source:'customrecord_sxrd_fee_schedule'});
         			invoiceDetailsSublist.addField({id : 'custpage_amount',label : 'Amount',type : 'currency'});
         			invoiceDetailsSublist.addField({id : 'custpage_taxamount',label : 'Tax Amount',type : 'currency'});
         			invoiceDetailsSublist.addField({id : 'custpage_adjuster_amount',label : 'Adjuster Amount',type : 'currency'});
         			
         			
         			
         			
         			var salesorderSearchObj = search.create({
         				   type: "salesorder",
         				   filters: [["type","anyof","SalesOrd"],  
         					   "AND", ["internalidnumber","equalto",tran_id], 
                                     "AND", 
      ["mainline","is","F"], 
      "AND", 
      ["taxline","is","F"], 
      "AND", 
      ["cogs","is","F"]
         					//   "AND",  ["account","anyof","236"],  
         					   ],
         				   columns:[search.createColumn({name: "internalid",summary: "GROUP",label: "Internal ID"}),
         					   		search.createColumn({name: "tranid",join: "applyingtransaction",summary: "GROUP",label: "Document Number" }),
         					   		search.createColumn({name: "total",join: "applyingtransaction",summary: "GROUP",label: "Amount (Transaction Total)" }),
         					   		search.createColumn({name: "custbody_sxrd_invoice_gross_loss",join: "applyingTransaction",summary: "MAX",label: "Invoice Gross Loss"}),
         					        search.createColumn({name: "formulatext",summary: "MAX",formula: "{applyingtransaction.custbody_sxrd_fee_schedule.id}",label: "Fee Schedule" }),
         					        search.createColumn({name: "internalid",join: "applyingTransaction",summary: "GROUP",label: "Internal ID"}),
         					        search.createColumn({name: "custbody_sxrd_insured_name",summary: "MAX", label: "Insured Name"})
         					         ]
         				   });
         			var runSearch=salesorderSearchObj.run();
         			if(runSearch!=null && runSearch!=''){
         			var results=runSearch.getRange({start: 0,end: 999});
         			if(results.length>0){
         			
         				 for(var i=0; results.length != null && i<results.length;i++){
         					// log.debug('results',results);
         				//	 log.debug('i',i);
         		        	 var claimID = results[i].getValue({name:"internalid",summary: "GROUP"});//,summaary: "GROUP"
         		       // 	 log.debug('claimID'+claimID);
         		        	 var invoiceID= results[i].getValue({name:"tranid",join: "applyingtransaction",summary: "GROUP"});
         		       // 	 log.debug('invoiceID'+invoiceID);
         		        	 var invoiceIntenalID= results[i].getValue({name:"internalid",join: "applyingtransaction",summary: "GROUP"});
         		      //  	 log.debug('invoiceIntenalID'+invoiceIntenalID);
         		        	 if(invoiceIntenalID){
         		        	 var invoiceAdjuster = search.lookupFields({type: search.Type.INVOICE,id: invoiceIntenalID,columns: ['tranid','custbody_sxrd_adjuster']});
         		      //  	 log.debug('invoiceAdjuster'+invoiceAdjuster);
         		        	 var invoiceAdjusterId =invoiceAdjuster.custbody_sxrd_adjuster;
         		      //  	 log.debug('invoiceAdjusterId'+invoiceAdjusterId);
         		        	// if(currentAdjsterId == invoiceAdjuster){
         		        		 
         		        		 
         		        	 var invoiceAmount = results[i].getValue({name: "total",join: "applyingtransaction",summary: "GROUP"});
         		   //     	 log.debug('invoiceAmount'+invoiceAmount);
         		        	 var invoiceGrossLoss = results[i].getValue({name: "custbody_sxrd_invoice_gross_loss",join: "applyingtransaction",summary: "MAX"});
         		   //     	 log.debug('invoiceGrossLoss'+invoiceGrossLoss);
         		        	 var fee_schedule = results[i].getValue({name: "formulatext",summary: "MAX"});
         		   //     	 log.debug('fee_schedule'+fee_schedule);
         		        	 if(invoiceGrossLoss){
         		        	 invoiceSublist.setSublistValue({id: 'custpage_invoice_grossloss',line: i,   value:invoiceGrossLoss });//line: i,
         		        	 }
         		        	 if(invoiceID){
         		        	 invoiceSublist.setSublistValue({id: 'custpage_invoiceid',line: i,   value:invoiceID });
         		        	 }
         		        	 if(invoiceAmount){
         		        	 invoiceSublist.setSublistValue({id: 'custpage_amount',line: i,   value:invoiceAmount });
         		        	 }
         		        	 if(fee_schedule){
         		        	 invoiceSublist.setSublistValue({id: 'custpage__fee_schedule',line: i,   value:fee_schedule });
         		        	 }
         		        	 
         		        	 var numLines = invoiceDetailsSublist.lineCount;
     		 		        	var so_item=new Array();
     		 	//	        	log.debug('numLines'+numLines);
     		 		        	var numLinesCount = invoiceDetailsSublist.lineCount;
     		 	//	        	log.debug('numLinesCount'+numLinesCount);
      		 				var so_item=form.getSublist({id: 'custpage_invoice_details'});
     		 	//	        	log.debug('so_item',so_item.lineCount);
     		 		        	
     		 		        	
         		        	 var invoiceSearchObj  = search.create({
         		 				   type: "invoice",
         		 				   filters: [["type","anyof","CustInvc"],  
         		 					   "AND", ["numbertext","is",invoiceID], 
         		 					//   "AND",  ["account","anyof","121"],  
                                             "AND", 
      ["mainline","is","F"], 
      "AND", 
      ["taxline","is","F"]
         		 					   ],
         		 				   columns:[search.createColumn({name: "trandate", label: "Date"}),
         		 					      search.createColumn({name: "type", label: "Type"}),
         		 					      search.createColumn({name: "tranid", label: "Document Number"}),
         		 					      search.createColumn({name: "entity", label: "Name"}),
         		 					      search.createColumn({name: "account", label: "Account"}),
         		 					      search.createColumn({name: "memo", label: "Memo"}),
         		 					      search.createColumn({name: "item", label: "Item"}),
         		 					      search.createColumn({name: "quantity", label: "Quantity"}),
         		 					      search.createColumn({name: "amount", label: "Amount"}),
         		 					      search.createColumn({name: "amountpaid", label: "Amount Paid"}),
         		 					      search.createColumn({name: "custcol_sxrd_adjustor_amount", label: "Adjuster Amount"}),
         		 					      search.createColumn({name: "amountremaining", label: "Amount Remaining"}),
         		 					      search.createColumn({name: "taxamount", label: "Amount (Tax)"}),
         		 					      search.createColumn({name: "custbody_sxrd_adjuster", label: "Adjuster"})
         		 					   		]
         		 				   });
         		 			var runSearch1=invoiceSearchObj.run();
         		 			if(runSearch1!=null && runSearch1!=''){
         		 			var results1=runSearch1.getRange({start: 0,end: 10});
         		 			if(results1.length>0){
         		 				if(numLinesCount == -1){
         		 				 for(var j=0; results1.length != null && j<results1.length;j++){
         		 					 
         		 					// log.debug('results1',results);
         	    			//		 log.debug('j',j);
         	    				
         		 		        	 var invoiceID = results1[j].getValue({name:"tranid"});//,summaary: "GROUP"
         		 		   //     	 log.debug('invoiceID'+invoiceID);
         		 		        	 var item_description =  results1[j].getValue({name:"memo"});
         		 		  //      	 log.debug('item_description'+item_description);
         		 		        	 var item_value= results1[j].getValue({name:"item"});
         		 		   //     	 log.debug('item_value'+item_value);
         		 		        	 var item_quantity= results1[j].getValue({name:"quantity"});
         		 		  //      	 log.debug('item_quantity'+item_quantity);
         		 		        	 var invoiceAmount = results1[j].getValue({name: "amount"});
         		 		  //      	 log.debug('invoiceAmount'+invoiceAmount);
         		 		        	 var adjusterAmount = results1[j].getValue({name: "custcol_sxrd_adjustor_amount"});
         		 		  //      	 log.debug('adjusterAmount'+adjusterAmount);
         		 		        	 var item_tax_amount = results1[j].getValue({name: "taxamount"});
         		 		 //       	 log.debug('item_tax_amount'+item_tax_amount);
         		 		        	
             		        	 if(invoiceID){
         		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_invoiceid_details',line: j,   value:invoiceID });
         		 				 }
             		        	 if(item_description){
         		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_description',line: j,   value:item_description });
             		        	 }
             		        	 if(item_value){
         		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_item',line: j,   value:item_value });
             		        	 }
             		        	 if(item_quantity){
         		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_quantity',line: j,   value:item_quantity });
             		        	 }
             		        	 if(invoiceAmount){
         		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_amount',line: j,   value:invoiceAmount });
             		        	 }
             		        	 if(adjusterAmount){
         		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_adjuster_amount',line: j,   value:adjusterAmount });
             		        	 }
             		        	 if(item_tax_amount){
         		 		        		invoiceDetailsSublist.setSublistValue({id: 'custpage_taxamount',line: j,   value:item_tax_amount }); 
             		        	 }
             		 		        	//invoiceDetailsSublist.commitLine({sublistId: 'item'});
         		 		        	// }
         		 				 }
         		 		        	// invoiceSublist.setSublistValue({id: 'custpage_amount',line: i,   value:invoiceAmount });
         		 				}else{
         		 					log.debug('logic worked');
         		 					 for(var j=0; results1.length != null && j<results1.length;j++){
             		 					 
             		 					// log.debug('results1',results);
             	    					 log.debug('j',j);
             	    					 
             	    				/*	 var adjuster = results1[j].getValue({name:"custbody_sxrd_adjuster"});//,summaary: "GROUP"
             		 		        	 log.debug('adjuster'+adjuster);
             		 		        	 if(adjuster == currentAdjsterId){*/
             	    					 
             		 		        	 var invoiceID = results1[j].getValue({name:"tranid"});//,summaary: "GROUP"
             		 		    //    	 log.debug('invoiceID'+invoiceID);
             		 		        	 var item_description =  results1[j].getValue({name:"memo"});
             		 		   //     	 log.debug('item_description'+item_description);
             		 		        	 var item_value= results1[j].getValue({name:"item"});
             		 		    //    	 log.debug('item_value'+item_value);
             		 		        	 var item_quantity= results1[j].getValue({name:"quantity"});
             		 		    //    	 log.debug('item_quantity'+item_quantity);
             		 		        	 var invoiceAmount = results1[j].getValue({name: "amount"});
             		 		    //    	 log.debug('invoiceAmount'+invoiceAmount);
             		 		        	 var adjusterAmount = results1[j].getValue({name: "custcol_sxrd_adjustor_amount"});
             		 		   //     	 log.debug('adjusterAmount'+adjusterAmount);
             		 		        	 var item_tax_amount = results1[j].getValue({name: "taxamount"});
             		 		  //     	 log.debug('item_tax_amount'+item_tax_amount);
         		 					
                 		        	 if(invoiceID){
             		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_invoiceid_details',line: numLinesCount+j,   value:invoiceID });
                 		        	 }
                 		        	 if(item_description){
             		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_description',line: numLinesCount+j,   value:item_description });
                 		        	 }
                 		        	 if(item_value){
             		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_item',line: numLinesCount+j,   value:item_value });
                 		        	 }
                 		        	 if(item_quantity){
             		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_quantity',line: numLinesCount+j,   value:item_quantity });
                 		        	 }
                 		        	 if(invoiceAmount){
             		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_amount',line: numLinesCount+j,   value:invoiceAmount });
                 		        	 }
                 		        	 if(adjusterAmount){
             		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_adjuster_amount',line: numLinesCount+j,   value:adjusterAmount });
                 		        	 }
                 		        	 if(item_tax_amount){
             		 		        	invoiceDetailsSublist.setSublistValue({id: 'custpage_taxamount',line: numLinesCount+j,   value:item_tax_amount }); 
                 		        	 }
         		 				}
         		 					 }
         		 				}	// return true;
         		 			}
         		 			//}
         		        	// invoiceSublist.setSublistValue({id: 'custpage_amount',line: i,   value:invoiceAmount });
         				 }//if(invoiceInternalID)
         				}
         		        	// return true;
         			}
        		 }
         			var remainingUsage = runtime.getCurrentScript().getRemainingUsage();
              		 log.debug('remainingUsage : ' +remainingUsage)	
           		
           			form.addSubmitButton({ label : 'Search New One'});
           			context.response.writePage(form);
    		}
    		}
    		function showResults(context) {
    			var request = context.request;
    			var tran_id=request.parameters.custpage_tranid;
    			//var carrier = request.parameters.custpage_carrier;
    			//log.debug('carrier',carrier);
    			var so_id=request.parameters.custpage_so_id;
    			var grossValue = request.parameters.custpage_inv_gossloss;
    			var feeScheduleId =  request.parameters.custpage_feeschedule;
    			if(tran_id!='' && tran_id!='' && (so_id=='' || so_id==null)){
    			var so_filters=new Array();//""
    			var tax_results='';
    			//so_filters[so_filters.length]=search.createFilter({name: 'tranid',operator: 'is',values: tran_id});
    			so_filters[so_filters.length]=search.createFilter({name: 'numbertext',operator: 'is',values: tran_id});
    			//so_filters[so_filters.length]=search.createFilter({name: 'entity',operator: 'anyof',values: carrier});
    			so_filters[so_filters.length]=search.createFilter({name: 'mainline',operator: 'is',values: true});
    			var so_search=search.create({type:'salesorder',filters:so_filters});//salestaxitem
    			var runSearch=so_search.run();
    			/**var cols=new Array();
    			cols[cols.length] = search.createColumn({name: 'itemid'});
    			var tax_search=search.create({type:'salestaxitem',columns:cols});//
    			var run_tax_search=tax_search.run();
    			if(run_tax_search!=null && run_tax_search!=''){
    			tax_results=run_tax_search.getRange({start: 0,end: 999});
    			}*/
    			if(runSearch!=null && runSearch!=''){
    			var results=runSearch.getRange({start: 0,end: 10});
    			if(results.length>0){
    			var html='<script>window.location.href="https://4667405.app.netsuite.com/app/site/hosting/scriptlet.nl?script=206&deploy=1&doc_id='+results[0].id+'"</script>';
    			context.response.write(html);
    			}else{
    				context.response.write('<p>Claim Number not found. Please check your claimnumber or contact administrator.</p>');
    			}
    			}else{
    			context.response.write('<p>There is no match </p>'); 
    			}
    			
    			}else{
    				var form = ui.createForm({ title : 'Request for Invoice'});
        			var req = context.request;
        			var soSearch = form.addField({id : 'custpage_tranid',type : ui.FieldType.TEXT,label : 'Claim# SEARCH'});
        			//var carrierSearch = form.addField({id : 'custpage_carrier',type : ui.FieldType.SELECT,label : 'Carrier SEARCH', source : 'customer'});
        			soSearch.isMandatory = true;
        			//carrierSearch.isMandatory = true;
        			form.addSubmitButton({ label : 'Search'});


    	        	context.response.writePage(form);
    			}
    		}

    return {
        onRequest: onRequest
    };
    
});
