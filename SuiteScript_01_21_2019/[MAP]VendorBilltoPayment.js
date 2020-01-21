/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/runtime', 'N/email', 'N/error'],

function(record, search, runtime, email, error) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
	function handleErrorAndSendNotification(e, stage)
    {
        log.error('Stage: ' + stage + ' failed', e);

        var author = 22085;
        var recipients = 'ameka@470claims.com';
        var subject = 'Map/Reduce script ' + runtime.getCurrentScript().id + ' failed for stage: ' + stage;
        var body = 'An error occurred with the following information:\n' +
                   'Error code: ' + e.name + '\n' +
                   'Error msg: ' + e.message;

        email.send({
            author: author,
            recipients: recipients,
            subject: subject,
            body: body
        });
    }

    function handleErrorIfAny(summary)
    {
        var inputSummary = summary.inputSummary;
        var mapSummary = summary.mapSummary;
        var reduceSummary = summary.reduceSummary;

        if (inputSummary.error)
        {
            var e = error.create({
                name: 'INPUT_STAGE_FAILED',
                message: inputSummary.error
            });
            handleErrorAndSendNotification(e, 'getInputData');
        }

        handleErrorInStage('map', mapSummary);
       // handleErrorInStage('reduce', reduceSummary);
    }

    function handleErrorInStage(stage, summary)
    {
        var errorMsg = [];
        summary.errors.iterator().each(function(key, value){
            var msg = 'Failure to accept payment from customer id: ' + key + '. Error was: ' + JSON.parse(value).message + '\n';
            errorMsg.push(msg);
            return true;
        });
        if (errorMsg.length > 0)
        {
            var e = error.create({
                name: 'RECORD_TRANSFORM_FAILED',
                message: JSON.stringify(errorMsg)
            });
            handleErrorAndSendNotification(e, stage);
        }
    }

    function createSummaryRecord(summary)
    {
        try
        {
            var seconds = summary.seconds;
            var usage = summary.usage;
            var yields = summary.yields;

            var rec = record.create({
                type: 'customrecord_summary',
            });

            rec.setValue({
                fieldId : 'name',
                value: 'Summary for M/R script: ' + runtime.getCurrentScript().id
            });

            rec.setValue({
                fieldId: 'custrecord_time',
                value: seconds
            });
            rec.setValue({
                fieldId: 'custrecord_usage',
                value: usage
            });
            rec.setValue({
                fieldId: 'custrecord_yields',
                value: yields
            });

            rec.save();
        }
        catch(e)
        {
            handleErrorAndSendNotification(e, 'summarize');
        }
    }
    function getInputData() {
    	
   // 	var invoiceSearchObj = 
  
    		return search.create({
            type: "invoice",
            filters: [
                ["type", "anyof", "CustInvc"],
                "AND",
                ["status", "anyof", "CustInvc:B"],
                "AND",
                ["mainline", "is", "T"],
                "AND",
                ["applyingtransaction.datecreated","on","today"]
                
                
            ],
            columns: [
                search.createColumn({
                    name: "internalid",
                    label: "Internal ID"
                }),
                search.createColumn({
                    name: "tranid",
                    label: "Document Number"
                }),
                search.createColumn({
                    name: "entity",
                    label: "Name"
                }),
                search.createColumn({
                    name: "amount",
                    label: "Amount"
                }),
                search.createColumn({
                    name: "applyingtransaction",
                    label: "Applying Transaction"
                }),
                search.createColumn({
                    name: "total",
                    join: "applyingTransaction",
                    label: "PaidAmount"
                }),
                search.createColumn({
                    name: "amountpaid",
                    join: "applyingTransaction",
                    label: "Amountpaid"
                }),
                search.createColumn({
                    name: "amountpaid",
                    label: "Amount Paid"
                }),
                search.createColumn({
                    name: "closedate",
                    label: "Date Closed"
                }),
                search.createColumn({
                	name: "amountremaining", 
                	label: "Amount Remaining"
                })
            ]
        });
    		
    		var scriptObj = runtime.getCurrentScript();
        	
        	//log.debug({title:"Remaining Usage StartGETINPUT", value:scriptObj.getRemainingUsage()});
        var resultset = invoiceSearchObj.run();
        var results = resultset.getRange(0, 999);
       // if (results) {
         /*   log.debug({
                title: 'results',
                details: results
            });*/
            for (var i = 0; results != null && i < results.length; i++){
            	 /*  log.debug({
                    title: 'i',
                    details: i
                });*/
                var result = results[i];
                /*  log.debug({
                    title: 'result',
                    details: result
                });*/
                var invoice_docnum = results[i].getValue('tranid');
                /* log.debug({
                    title: 'invoice_docnum',
                    details: invoice_docnum
                });*/
                var invoice_amount = results[i].getValue('amount');
                /*  log.debug({
                    title: 'invoice_amount',
                    details: invoice_amount
                });*/
                var invoice_amountpaid = results[i].getValue('amountpaid');
                /*  log.debug({
                    title: 'invoice_amountpaid',
                    details: invoice_amountpaid
                });*/
                /*
                if (invoice_amount == invoice_amountpaid) {
                    var vendorbillSearchObj =	search.create({
                        type: "vendorbill",
                        filters: [
                            ["type", "anyof", "VendBill"],
                            "AND",
                            ["mainline", "is", "T"],
                            "AND",
                            ["status", "anyof", "VendBill:A"],
                            "AND",
                            ["numbertext", "is", invoice_docnum]
                        ],
                        columns: [
                            search.createColumn({
                                name: "internalid",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "trandate",
                                sort: search.Sort.ASC,
                                label: "Date"
                            }),
                            search.createColumn({
                                name: "statusref",
                                label: "Status"
                            }),
                            search.createColumn({
                                name: "type",
                                label: "Type"
                            }),
                            search.createColumn({
                                name: "tranid",
                                label: "Document Number"
                            }),
                            search.createColumn({
                                name: "entity",
                                label: "Name"
                            }),
                            search.createColumn({
                                name: "account",
                                label: "Account"
                            }),
                            search.createColumn({
                                name: "amount",
                                label: "Amount"
                            }),
                            search.createColumn({
                                name: "amountremaining",
                                label: "Amount Remaining"
                            }),
                            search.createColumn({
                                name: "amountpaid",
                                label: "Amount Paid"
                            })
                        ]
                    });
                    var arrResults = new Array();
                    var bill_internalid = "";
                    var resultset_bill = vendorbillSearchObj.run();
                    var results_bill = resultset_bill.getRange(0, 1000);
                 //   if (results_bill) {
                        log.debug({
                            title: 'results_bill',
                            details: results_bill
                        });
                        for (var j = 0; results_bill != null && j < results_bill.length; j++) {
                            log.debug({
                                title: 'j',
                                details: j
                            });
                            var result1 = results_bill[j];
                            log.debug({ title: 'result1', details: result1});
                            //var bill_docnum = results_bill[i].getValue('tranid');
                            //log.debug( { title: 'bill_docnum', details: bill_docnum});
                            var bill_internalid = results_bill[j].getValue('internalid');
                            log.debug({
                                title: 'bill_internalid',
                                details: bill_internalid
                            });
                            var bill_amount = results_bill[j].getValue('amount');
                            log.debug({
                                title: 'bill_amount',
                                details: bill_amount
                            });
                            
                           // return bill_internalid;
                            log.debug({
                                title: 'RETURN'
                            });
                        }
                }*/
            }
            
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	//log.debug('context', context.value);
    	var rowJson = JSON.parse(context.value);
    	invoiceInternalid = rowJson.values['internalid'].value
    	//log.debug('invoiceInternalid', invoiceInternalid);
    	invoice_docnum = rowJson.values['tranid']
    	//log.debug('invoice_docnum', invoice_docnum);
    	invoice_amount = rowJson.values['amount']
    	//log.debug('invoice_amount', invoice_amount);
    	invoice_amountpaid = rowJson.values['amountpaid']
    	//log.debug('invoice_amountpaid', invoice_amountpaid);
    	invoice_amountremaning = rowJson.values['amountremaining']
    	//log.debug('invoice_amountremaning', invoice_amountremaning);
    	var scriptObj = runtime.getCurrentScript();
    	
    	//log.debug("Remaining Usage Start", scriptObj.getRemainingUsage());

    	
    	if ((invoice_amount == invoice_amountpaid)&&(invoice_amountremaning == 0.00)) {
        var vendorbillSearchObj =	search.create({
            type: "vendorbill",
            filters: [
                ["type", "anyof", "VendBill"],
                "AND",
                ["mainline", "is", "T"],
                "AND",
                ["status", "anyof", "VendBill:A"],
                "AND",
                ["numbertext", "is", invoice_docnum]
            ],
            columns: [
                search.createColumn({
                    name: "internalid",
                    label: "Internal ID"
                }),
                search.createColumn({
                    name: "trandate",
                    sort: search.Sort.ASC,
                    label: "Date"
                }),
                search.createColumn({
                    name: "statusref",
                    label: "Status"
                }),
                search.createColumn({
                    name: "type",
                    label: "Type"
                }),
                search.createColumn({
                    name: "tranid",
                    label: "Document Number"
                }),
                search.createColumn({
                    name: "entity",
                    label: "Name"
                }),
                search.createColumn({
                    name: "account",
                    label: "Account"
                }),
                search.createColumn({
                    name: "amount",
                    label: "Amount"
                }),
                search.createColumn({
                    name: "amountremaining",
                    label: "Amount Remaining"
                }),
                search.createColumn({
                    name: "amountpaid",
                    label: "Amount Paid"
                })
            ]
        });
    //    var arrResults = new Array();
     //   var bill_internalid = "";
        var resultset_bill = vendorbillSearchObj.run();
        var results_bill = resultset_bill.getRange(0, 1000);
     //   if (results_bill) {
        /*  log.debug({
                title: 'results_bill',
                details: results_bill
            });*/
            for (var j = 0; results_bill != null && j < results_bill.length; j++) {
            	 /*  log.debug({
                    title: 'j',
                    details: j
                });*/
                var result1 = results_bill[j];
              //  log.debug({ title: 'result1', details: result1});
                //var bill_docnum = results_bill[i].getValue('tranid');
                //log.debug( { title: 'bill_docnum', details: bill_docnum});
                var bill_internalid = results_bill[j].getValue('internalid');
                /*   log.debug({
                    title: 'bill_internalid',
                    details: bill_internalid
                });*/
                var bill_amount = results_bill[j].getValue('amount');
                /*   log.debug({
                    title: 'bill_amount',
                    details: bill_amount
                });*/
    	 var vendorpayment = record.transform({ //Creates VendorPayment
             fromType: record.Type.VENDOR_BILL,
             fromId: bill_internalid,
             toType: record.Type.VENDOR_PAYMENT,
             isDynamic: true,
         });
    	 var vendpayment = vendorpayment.save({
             ignoreMandatoryFields: true
         });
    	 /* log.debug({
             title: 'vendpayment',
            	 value: vendorpayment
         });*/
         var scriptObj = runtime.getCurrentScript();
     	
     	//log.debug({title:"Remaining Usage StartMAP", value:scriptObj.getRemainingUsage()});
    	
        // if(vendpayment){
        	 context.write({key : bill_internalid, value  : vendorpayment});
        	/* log.debug({
                 title: 'context.write(bill_internalid, vendorpayment);'
                //value: context.getRemainingUsage();
             }); */
        	 
        // }
         
    }
    }/*else{
    	log.debug({
            title: 'elsepart',
           	 //value: vendpayment
        });
    }*/
    
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {

    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	
    	 handleErrorIfAny(summary);
         createSummaryRecord(summary);
         /*
    	var subject = "Map or reduce script";
    	var message = "Vendor bill created.\n\n";
    	var userid = 22085; //runtime.getCurrentUser().id;
    	log.debug({
            title: 'userid',
            details: userid
        });
    	var contents = '';
    	 //Use summary.output which will contain list of key-value pair that we have entered at end of map() function
    	summary.output.iterator().each(function(key, value) {
    	               contents += "New VendorPayment created(ID: " + value + ") against BillIntrnalid(ID: "+ key +") \n\n";
    	           
    	               return true;
    	       });
    	message += contents;
    	email.send({author: userid,
    	recipients: 'ameka@470claims.com',
    	subject: subject,
    	body: message
    	});
    	log.debug('——-SCRIPT——–  —-END——-');
    	*/
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
