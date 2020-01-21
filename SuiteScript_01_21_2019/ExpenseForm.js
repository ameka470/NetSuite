/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 May 2018     ameka
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function expense_form(request, response){

	 try
		{
	 if ( request.getMethod() == 'GET' )
	   {
			var form = nlapiCreateForm('Expense Form');
			var fldclaimeNo = form.addField('custpage_claimnum', 'text', 'CLAIM NUMBER');
			form.addSubmitButton('Submit');
			response.writePage(form);
		
	   }
	 
	 
	 else
	   {
	   
		nlapiLogExecution('DEBUG','In Else ');
		var o_context = nlapiGetContext();
		
		var i_user_logegdIn_id = o_context.getUser();
		var supervisor1 = nlapiLookupField('employee',i_user_logegdIn_id,'supervisor'); // supervisor name

		var claimNum = request.getParameter('custpage_claimnum');
		nlapiLogExecution('DEBUG','claimNum', claimNum);
	    var salesorderSearch = nlapiSearchRecord("salesorder",null,
			 [
				["type","anyof","SalesOrd"],
			    "AND", 
			    ["mainline","is","T"], 
			    "AND", 
			     ["tranid","is",claimNum]
			 ], 
			 [
			    new nlobjSearchColumn("internalid"), 
			    new nlobjSearchColumn("tranid")
			 ]
			 );
			nlapiLogExecution('DEBUG','salesorderSearch',salesorderSearch);
			if(salesorderSearch)
			{
				
				var claimnumber = salesorderSearch[0].getValue('internalid');
				nlapiLogExecution('DEBUG','claimnumber= ',claimnumber);
				var obj = nlapiLoadRecord('salesorder',claimnumber);
				// lineCount = obj.getLineItemCount('item');
				//nlapiLogExecution('DEBUG','lineCount= ',lineCount);
				var entity1 = obj.getFieldValue('custbody12'); // Policy number
				var inv1 = obj.getFieldValue('tranid'); // claim number
				var createdfrom1 = obj.getFieldValue('createdfrom');
				var inv2 = obj.getFieldText('custbody_sxrd_adjuster'); //Adjuster Name
				var adjuster1 = obj.getFieldValue('custbody_sxrd_adjuster');
				//var inv3 = obj.getFieldValue('trandate'); //Date present on invoice
				
				var inv4 = obj.getFieldText('entity'); //Carrier or Customer Name
				var entity2 = obj.getFieldValue('entity');
				var form = nlapiCreateForm('Expense Form');
				var fldinvoiceNo1 = form.addField('custpage_claim1', 'text', 'CLAIM NUMBER').setDisplayType('hidden');
				
				nlapiSetFieldValue('custpage_claim1',claimnumber);
				
				form.addField('custpage_invnum2', 'text', 'CARRIER NAME').setDisabled(true);
				form.addField('custpage_invnum3', 'text', 'POLICY NUMBER').setDisabled(true);
				form.addField('custpage_invnum4', 'text', 'CLAIM NUMBER').setDisabled(true);
				form.addField('custpage_invnum5', 'text', 'ADJUSTER NAME').setDisabled(true);
				//form.addField('custpage_invnum6', 'textarea', 'Reason');
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
				form.setFieldValues({  'custpage_invnum4' :inv1}); //claim Number
				form.setFieldValues({  'custpage_invnum5' :inv2}); //Adjuster name
				form.setFieldValues({  'custpage_invnum2' :inv4}); //Customer or ccarrier name
				form.setFieldValues({  'custpage_invnum3' :entity1}); //Policy number
				form.setFieldValues({  'custpage_supervisor' :supervisor1}); //Supervisor Name
				//form.setFieldValues({  'custpage_invnum31' :createdfrom1}); //claim Number
				//form.setFieldValues({  'custpage_invnum51' :entity2}); //Carrier name
				//form.setFieldValues({  'custpage_invnum21' :adjuster1}); //Adjuster name
				//form.setFieldValues({  'custpage_invnum41' :entity1}); //Invoice number
				form.setFieldValues({  'custpage_invnum7' :i_user_logegdIn_id}); 
				
				var sublist = form.addSubList('custpage_sublist','inlineeditor', 'Items');
				sublist.addField('sublistitem','text','Items');//
				sublist.addField('sublistquantity','text','Quantity');
				sublist.addField('sublistdesc', 'text', 'Description');
				sublist.addField('sublistpricelevel', 'text', 'Price Level');//
				
				//=============================================================================================
				
				
				form.setScript('customscript_cliexpenseapproval');
				
				
				//=============================================================================================
				form.addButton('approvebutton','Send For Approval','send_approval_status()');
				
				response.writePage(form);
				
				
				
			}
			else
				{
				var form = nlapiCreateForm('Expense Form');
				var fldinvoiceNo = form.addField('custpage_claimnum', 'text', 'CLAIM NUMBER');
				form.addSubmitButton('Submit');
				response.writePage(form);
				}
			
		
	   
		
	   }
	}catch(exp)
				{
					nlapiLogExecution('DEBUG', 'suitelet1', 'exp '+exp);
				}	
			

}
