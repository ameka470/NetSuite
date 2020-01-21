/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Mar 2019     ameka
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function userEventBeforeSubmitLastModifiedBy(type){
	try{
      nlapiLogExecution('Debug', 'type=',type);
	if(type == 'edit' || type == 'xedit')
	{
		//nlapiLogExecution('Debug', 'type=',type);
	/*	var vendorinternalid = nlapiGetRecordId();
		nlapiLogExecution('Debug', 'vendorinternalid=',vendorinternalid);
		if(vendorinternalid)
			{
			var vendorSearch = nlapiSearchRecord("vendor",null,
					[
						["internalid","anyof",vendorinternalid]
					], 
					[
					  // new nlobjSearchColumn("formulatext",null,"MAX").setFormula("max(to_char(substr({systemnotes.name},1,3900))) keep(dense_rank last order by {systemnotes.date})"), 
						 new nlobjSearchColumn("internalid",null,"GROUP").setSort(false),
						 new nlobjSearchColumn("date","systemNotes","MAX"), 
						new nlobjSearchColumn("name","systemNotes","MAX") 
					   
					  
					]
					//);
					);
			for(var i = 0; vendorSearch != null && i < vendorSearch.length; i++)
				{
				nlapiLogExecution('Debug', 'i_createinvoiceSearchdFrom=',vendorSearch.length);
				 var lastmodifiedname = vendorSearch[i].getText('name');
				 nlapiLogExecution('Debug', 'lastmodifiedname=',lastmodifiedname);
				 var lastmodifieddate = vendorSearch[i].getText('date');
				 nlapiLogExecution('Debug', 'lastmodifieddate=',lastmodifieddate);
				 if(lastmodifiedname)
				 nlapiSetFieldValue('custentityrecord_last_modified_by',lastmodifiedname);
				}
			}*/
		var user = nlapiGetUser();
		var context = nlapiGetContext();
		executioncontext = context.getExecutionContext();
		
		//nlapiLogExecution('Debug', 'user=',user);
		//nlapiLogExecution('Debug', 'context=',context);
		//nlapiLogExecution('Debug', 'executioncontext=',executioncontext);
		 var username =  nlapiLookupField('employee',user,'entityid');
      	var dellboomi =  nlapiLookupField('employee',22943,'entityid');
		// nlapiLogExecution('Debug', 'username',username);
      // nlapiLogExecution('Debug', 'dellboomi', dellboomi);
		nlapiLogExecution('Debug', 'executioncontext=',executioncontext);
		if(user){
			if(executioncontext == 'webservice'){
		 
				 rexordlastmodified = username + ', ' + executioncontext;
				 nlapiLogExecution('Debug', 'rexordlastmodified=',rexordlastmodified);
				 nlapiSetFieldValue('custentityrecord_last_modified_by',rexordlastmodified);
			}else if(executioncontext == 'mapreduce'){
              nlapiSetFieldValue('custentityrecord_last_modified_by','Internal Script');
            }else{
		 nlapiSetFieldValue('custentityrecord_last_modified_by',username);
		// nlapiLogExecution('Debug', 'done');
			}
	}
	}
	}catch(error){
		nlapiLogExecution('Debug', 'error=',error);
	}
}
