var search_ids=['customsearch_claims_related_records_3','customsearch246','customsearch152','customsearch115'];//internalid
var search_name=['Download Bill Report','Download Paid Items Report','Download Pending Items Report','Download Unpaid Items Report'];
var search1_textValues=["2"];
var search2_textValues=["1"];
var search3_textValues=["0"];
var search4_textValues=["0"];
function getReport(request, response){

	if(request.getMethod()=='GET'){
		var form=nlapiCreateForm('Report Screen');
		var field=form.addField('custpage_select','select','Select Report');
		field.addSelectOption(0,'');
		for(var i=0;i<search_ids.length;i++){
			field.addSelectOption(search_ids[i],search_name[i]);
		}
		field.setMandatory(true);
		form.addSubmitButton('Submit');
		response.writePage(form);
	}else{
		try{
			var search_id=request.getParameter('custpage_select');
             var user=nlapiGetUser();//
             nlapiLogExecution('debug','user',user);//
			if(search_id!=null && search_id!=''){
				var loadSarch=nlapiLoadSearch(null, search_id);
				var columns=loadSarch.getColumns();
				nlapiLogExecution('debug','columns',columns);
				loadSarch.addFilter(new nlobjSearchFilter('name', null, 'anyof', user));//
				var runSearch=loadSarch.runSearch();
				var results=getResults(runSearch,columns);
				if(results!='' && results!='' && results.length>0){
					var textValues='';
					if(search_id=='customsearch_claims_related_records_3'){
						textValues=search1_textValues;
					}else if(search_id=='customsearch246'){
						textValues=search2_textValues;
					}else if(search_id=='customsearch152'){
						textValues=search3_textValues;
					}else if(search_id=='customsearch115'){
						textValues=search4_textValues;
					}
					var file=create_csv(results,columns,search_id,textValues);
				
					var search_Text=search_name[search_ids.indexOf(search_id)];
					response.setContentType('CSV',search_Text+'.csv');
					response.write(file.getValue());
				}else{
					response.write('No results to show');
				}
			}
		}catch(e){
			nlapiLogExecution('error', 'error occured', e);
		}

	}



}
function getResults(cusSearch){
	var start=0;
	var totalResults=new Array();
	do {
		if(cusSearch!=null && cusSearch!=''){
			var results = cusSearch.getResults( start, start+1000);
			for(var s=0;s<results.length;s++){
				start++;
				totalResults[totalResults.length]=results[s];
			}

		}
	}while(results.length>=1000);
	return totalResults;

}


function create_csv(results,columns,search_id,textValues){
	nlapiLogExecution('debug','textValues',textValues);
	var data='';
	var row_product = new Array();
	var headers=new Array();
	for(var ph=0;ph<columns.length;ph++){
		headers[headers.length]=columns[ph].getLabel();
	}
	data += headers + '\n';

	for(var i=0;i<results.length;i++){

		var cols=results[i].getAllColumns();
		for(var j=0;j<headers.length;j++){
			var index=textValues.indexOf('0');
			
			if(index>0)
				row_product[j] =""+results[i].getText(cols[j])+"";
			else
				row_product[j] =""+results[i].getValue(cols[j])+"";
		}

		data += row_product + '\n';
	}
	var search_Text=search_name[search_ids.indexOf(search_id)];
	var file=nlapiCreateFile(search_Text+'.csv', 'CSV', data);
	return file;
}