function suitelet(request, response)
{
		 //call an nlobjRequest method 
		 try
			{
		 if ( request.getMethod() == 'GET' )
		   {
				var form = nlapiCreateForm('Invoice Adjustment Request');
				var fldinvoiceNo = form.addField('custpage_invnum', 'text', 'INVOICE NUMBER');
				form.addSubmitButton('Submit');
				response.writePage(form);
		   }
		 else
		   {
			var o_context = nlapiGetContext();
			var i_user_logegdIn_id = o_context.getUser();
			var supervisor1 = nlapiLookupField('employee',i_user_logegdIn_id,'supervisor'); // supervisor name
	
			var invoiceNo = request.getParameter('custpage_invnum');
				nlapiLogExecution('DEBUG','invoiceNo', invoiceNo);
				var invoiceSearch = nlapiSearchRecord("invoice",null,
				[
				   ["type","anyof","CustInvc"], 
				   "AND", 
				  ["numbertext","is",invoiceNo],
				   "AND", 
				   ["mainline","is","T"]
				], 
				[
				  
				    new nlobjSearchColumn("internalid"), 
					new nlobjSearchColumn("entity")
				  
				]
				);
				nlapiLogExecution('DEBUG','invoiceSearch',invoiceSearch);
				if(invoiceSearch)
				{
					
					var invnumber = invoiceSearch[0].getValue('internalid');
					nlapiLogExecution('DEBUG','invnumber= ',invnumber);
					var obj = nlapiLoadRecord('invoice',invnumber);
					// lineCount = obj.getLineItemCount('item');
					//nlapiLogExecution('DEBUG','lineCount= ',lineCount);
					var entity1 = obj.getFieldValue('tranid'); // invoice number
					var inv1 = obj.getFieldText('createdfrom'); // claim number
					var createdfrom1 = obj.getFieldValue('createdfrom');
					var inv2 = obj.getFieldText('custbody_sxrd_adjuster'); //Adjuster Name
					var adjuster1 = obj.getFieldValue('custbody_sxrd_adjuster');
					var inv3 = obj.getFieldValue('trandate'); //Date present on invoice
					
					var inv4 = obj.getFieldText('entity'); //Carrier or Customer Name
					var entity2 = obj.getFieldValue('entity');
					var form = nlapiCreateForm('Invoice Adjustment Request');
					var fldinvoiceNo1 = form.addField('custpage_invnum1', 'text', 'INVOICE NUMBER').setDisplayType('hidden');
					
					nlapiSetFieldValue('custpage_invnum1',invnumber);
					form.addField('custpage_invnum2', 'text', 'CARRIER NAME').setDisabled(true);
					form.addField('custpage_invnum3', 'text', 'ClAIM NUMBER').setDisabled(true);
					form.addField('custpage_invnum4', 'text', 'INVOICE NUMBER').setDisabled(true);
					form.addField('custpage_invnum5', 'text', 'ADJUSTER NAME').setDisabled(true);
					form.addField('custpage_invnum6', 'textarea', 'Reason');
					form.addField('custpage_invnum7', 'select', 'Requested By','employee').setDisabled(true);
					 
					
					form.addField('custpage_supervisor', 'select', 'SUPERVISOR','employee').setDisplayType('hidden');
					//var fldinvoiceNo31 = form.addField('custpage_invnum31', 'text', 'ClAIM NUMBER').setDisplayType('hidden');
					//var fldinvoiceNo41 = form.addField('custpage_invnum41', 'text', 'INVOICE NUMBER').setDisplayType('hidden');
					//var fldinvoiceNo51 = form.addField('custpage_invnum51', 'text', 'ADJUSTER NAME').setDisplayType('hidden');
					var today = new Date();
					    var dd = today.getDate();
					    var mm = today.getMonth()+1;
					    var yyyy = today.getFullYear();
					    today = mm+'/'+dd+'/'+yyyy; 
					form.addField('date', 'date', 'Date').setDisabled(true); 
					//form.addField('name', 'text', 'Name').setDisabled(true); 
					//form.addField('email', 'email', 'Email').setDisabled(true); 
					//form.addField('phone', 'phone', 'Phone').setDisabled(true); 
                  form.setFieldValues( { 'date':today});  //Current Date
					form.setFieldValues({  'custpage_invnum3' :inv1}); //claim Number
					form.setFieldValues({  'custpage_invnum5' :inv2}); //Carrier name
					form.setFieldValues({  'custpage_invnum2' :inv4}); //Adjuster name
					form.setFieldValues({  'custpage_invnum4' :entity1}); //Invoice number
					form.setFieldValues({  'custpage_supervisor' :supervisor1}); //Supervisor Name
					//form.setFieldValues({  'custpage_invnum31' :createdfrom1}); //claim Number
					//form.setFieldValues({  'custpage_invnum51' :entity2}); //Carrier name
					//form.setFieldValues({  'custpage_invnum21' :adjuster1}); //Adjuster name
					//form.setFieldValues({  'custpage_invnum41' :entity1}); //Invoice number
					form.setFieldValues({  'custpage_invnum7' :i_user_logegdIn_id}); 
					var sublist = form.addSubList('custpage_sublist','inlineeditor', 'Items');
					sublist.addField('sublistid','text','Billing Items');//
					sublist.addField('sublistname','text','Original Amount');
					sublist.addField('sublistemail', 'text', 'Revised Amount');//
					//=============================================================================================
					
					form.setScript('customscript_cliapproval');
					
					
					//=============================================================================================
					form.addButton('approvebutton','Send For Approval','send_approval()');
					
					response.writePage(form);
					
					
					
							
					
					
				}
				else
					{
					var form = nlapiCreateForm('Invoice Adjustment Request');
					var fldinvoiceNo = form.addField('custpage_invnum', 'text', 'INVOICE NUMBER');
					form.addSubmitButton('Submit');
					response.writePage(form);
					}
				
				
				
		   }
		}catch(exp)
					{
						nlapiLogExecution('DEBUG', 'suitelet', 'exp '+exp);
					}	
}