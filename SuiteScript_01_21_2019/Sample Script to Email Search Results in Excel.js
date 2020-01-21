/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Oct 2018     ameka
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function nationwide_email(type) {
	
	var invoiceSearch = nlapiSearchRecord("invoice",null,
			[
			   ["type","anyof","CustInvc"], 
			   "AND", 
			   ["mainline","is","T"], 
			   "AND", 
			   ["trandate","on","yesterday"], 
			   "AND", 
			   ["name","anyof","67"]
			], 
			[
				 new nlobjSearchColumn("formulanumeric").setFormula("rownum"), 
				  new nlobjSearchColumn("formulatext").setFormula("CONCAT('45', '-2408960')"), 
				  new nlobjSearchColumn("trandate").setSort(false), 
				  new nlobjSearchColumn("createdfrom"),
				// new nlobjSearchColumn("formulatext").setFormula("LTRIM ({createdfrom}, 'Claim #' )"), 
				  new nlobjSearchColumn("tranid"), 
				  new nlobjSearchColumn("formulatext").setFormula("TO_CHAR({amount},  '$9999999.99')")
				
				
			 //new nlobjSearchColumn("datecreated"), 
			   //new nlobjSearchColumn("tranid"), 
			   //new nlobjSearchColumn("createdfrom"), 
			   //new nlobjSearchColumn("amount")
			]
			);
	var column_name = " " + ',' + "TIN#" + ',' + "InvoiceDate" + ',' + "Claim#" + ',' + "VEND INV#" + ',' + "Total Bill Amount" + '\n'
	var contents = '';
	nlapiLogExecution('DEBUG', 'invoiceSearch', invoiceSearch);
	if(invoiceSearch){
	    for (var x = 0; x < invoiceSearch.length; x++){		 
           
            var rowNum = invoiceSearch[x].getValue('formulanumeric');
            nlapiLogExecution('DEBUG', 'rowNum', rowNum);
            var concat = invoiceSearch[x].getValue('formulatext');
            nlapiLogExecution('DEBUG', 'concat', concat);
            var tranDate = invoiceSearch[x].getValue('trandate');
            nlapiLogExecution('DEBUG', 'tranDate', tranDate);
            var claimNumber = invoiceSearch[x].getValue('createdfrom');
            nlapiLogExecution('DEBUG', 'tranDate', tranDate);
            var tranId = invoiceSearch[x].getValue('tranid');
            nlapiLogExecution('DEBUG', 'tranId', tranId);
            var amount_a = invoiceSearch[x].getValue('formulatext');
            nlapiLogExecution('DEBUG', 'amount_a', amount_a);
contents += rowNum + ',' + concat + ',' + tranDate + ',' + claimNumber + ',' + tranId + ',' + amount_a +'\n';
//nlapiLogExecution('DEBUG', 'contents', contents);
   }
	 
	    var today = new Date();
	    var dd = today.getDate();
	    var mm = today.getMonth()+1;
	    var yyyy = today.getFullYear();
	    today = mm+'/'+dd+'/'+yyyy; // change the format depending on the date format preferences set on your account
	    nlapiLogExecution('DEBUG', 'today', today);
	    subject = "Nationwide Daily Report:" + today;
	    nlapiLogExecution('DEBUG', 'subject', subject);
	    
	    
	   // return today;
var attachment = nlapiCreateFile('results.csv', 'CSV', contents);
nlapiLogExecution('DEBUG', 'attachment', attachment);
		
		nlapiSendEmail(2906,['ameka@470claims.com','anutej9955@gmail.com'], subject,'Please find the attached Nationwide Daily Report',null,null,null,attachment);
	}
}
