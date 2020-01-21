function UniqueCMSId(){
	//if(type == 'create' || type == 'edit'){
	var cmsno = nlapiGetFieldValue('custbody_sxrd_cms_no');
	//alert('custbody_sxrd_cms_no'+custbody_sxrd_cms_no);
	/*var salesorderSearch = nlapiSearchRecord("salesorder",null,
			[
			   ["type","anyof","SalesOrd"],
			   "AND",
			   ["mainline","is","T"],
			   "AND",
			   ["custbody_sxrd_cms_no","is","24073"]
			],
			[
			   new nlobjSearchColumn("tranid")
			]
			);*/
	var salesoreder_internalid = nlapiGetFieldValue('internalid');
	//alert('salesoreder_internalid'+salesoreder_internalid);
	if(cmsno !=null && cmsno != ''){
		var filter = new Array();
		filter[0] = new nlobjSearchFilter('custbody_sxrd_cms_no',null,'is',cmsno);
		 //filter[1] = new nlobjSearchFilter('mainline',null,'is','T');
		 //var column = new Array();
		//column[0] = new nlobjSearchColumn('internalid');
		//column[1] = new nlobjSearchColumn('tranid');
		var searchResults = nlapiSearchRecord('salesorder',null,filter,null);
      //alert(searchResults+'searchResults');
		if (searchResults != null && searchResults.length > 0)
		   {
             if(searchResults[0].getId() !== nlapiGetRecordId()){
		    alert('Claim is already present with this CMSNo. Please check Claim # and CMSNo and enter correct CMSNo.');// searchResults[0].getValue('tranid'));
		    return false;
             }
           }
		   //}
}
  //alert('null search result. Save the document')
     return true;
}



function autoGenerateCMS(type,name) {
  if(name == 'entity'){
  var customer = nlapiGetFieldValue('entity');
   //alert('customer1:'+customer);
   var salesoreder_internalId = nlapiGetFieldValue('id');
      	 	//alert('salesoreder_internalId1'+salesoreder_internalId);
       		var claim_num = nlapiGetFieldValue('tranid');
       		//alert('claim_num1:'+claim_num);
     var cmsno = nlapiGetFieldValue('custbody_sxrd_cms_no');
    //alert('cmsno:'+cmsno);
    if(cmsno == null || cmsno == ''){
  if( customer == 72){
     //alert('this is else part1');
         nlapiSetFieldValue('custbody_sxrd_cms_no','THTPA-'+claim_num);

     //alert('this is ending part1');
  }
    else if(customer == 21782){
      nlapiSetFieldValue('custbody_sxrd_cms_no','KTPA-'+claim_num);
    }
    else if(customer == 45){
      nlapiSetFieldValue('custbody_sxrd_cms_no','LM-'+claim_num);
    }
     else if(customer == 22837){
      nlapiSetFieldValue('custbody_sxrd_cms_no','LMS-'+claim_num);
    }
  }
}
}

/*function autoGenerate(type) {
	 if (type == 'create'|| type == 'edit'){
		 //var salesOrder = nlapiLoadRecord('salesorder',nlapiGetRecordId());
		 //alert('salesOrder'+salesOrder);
		  //nlapiLogExecution('Debug','salesOrder',salesOrder);
           var cmsno = nlapiGetFieldValue('custbody_sxrd_cms_no');
           alert('cmsno'+cmsno)
           nlapiLogExecution('DEBUG','cmsno',cmsno);
          var customer = nlapiGetFieldValue('entity');
          nlapiLogExecution('DEBUG','customer',customer);
          alert('customer'+customer);
          if( customer == 72 || customer == 21782 || customer ==45 || customer ==22837){
           var filter = new Array();
           //filter[0] = new nlobjSearchFilter('internalid', null, 'isnotempty', null);
       	filter[0] = new nlobjSearchFilter('entity',null,'is',customer);
		 filter[1] = new nlobjSearchFilter('mainline',null,'is','T');
		 var column = new Array();
           var col = new Array();
           col[0] = new nlobjSearchColumn('internalid');
   		col[1] = new nlobjSearchColumn('tranid');
   		col[2] = new nlobjSearchFilter('custbody_sxrd_cms_no');
   		var searchResult = nlapiSearchRecord('salesorder',null,filter,col);
   		alert('searchResult'+searchResult);
           //col[0] = new nlobjSearchColumn('itemid', null, null);
           //col[1] = new nlobjSearchColumn('internalid', null, null);
           //col[1].setSort(true);
           //var searchresult = nlapiSearchRecord('inventoryitem', null, filter, col);
           if (searchResult!=null || searchResult != ''){
           for(var i = 0; i <= 0; i++)
            {
              var cmsresult = searchResult[i].getValue('internalid');
              alert('cmsresult'+cmsresult);
              var getn = cmsresult.split('-');
               var x = parseInt(getn[1]);
               var name = "tpa" + x;
               nlapiSetFieldValue('custbody_sxrd_cms_no', getn[0]+'-'+name);
            }
        }
          }
    }
}
*/
