/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/sftp', 'N/ui/serverWidget', 'N/file', 'N/runtime','N/search'],

function(https, sftp, ui, file, runtime, search) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) {

		var mySearch = search.load({id: 'customsearch_ledes_format'});	//customsearch315
		   log.debug('mySearch', mySearch);
		   var columns = mySearch.columns;
		     log.debug('columns', columns);
		     log.debug('columns lenght', columns.length);
		     
		     
		   //  var runSearch=mySearch.run();
		   //  log.debug('runSearch', runSearch);
			//	var results=getResults(runSearch,columns);
			//	if(results!='' && results!='' && results.length>0){
					
				//	 log.debug('results', results);	
		     //Creating arrays that will populate results
	/*	    var content = new Array();
		     var cells = new Array();
		     var headers = new Array();
		     var temp = new Array();
		     var x = 0;
		     for(var i=0; i< columns.length; i++){
		         headers[i] = columns[i].label;//name;
		         log.debug('col ',headers[i]);  
		     }
		         content[x] =  headers;
		         log.debug('content[x] ',content[x]);
		         x =1;
		         //Looping through the search results
		         mySearch.run().each(function(result){
		          log.debug('content',content);
		          //looping through each columns
		          for(var y=0; y< columns.length; y++){
		           
		              var searchResult = result.getValue({
		               name: columns[y].name
		              });
		              log.debug('searchResult ',searchResult); 
		              temp[y] = searchResult;
		              log.debug('temp[y]',searchResult);  

		             } 
		         content[x] +=temp;
		         x++; 
		            return true; 
		            });
		         
		          //Creating a string variable that will be used as CSV Content
		          var contents='';
		          for(var z =0; z<content.length;z++){
		              contents +=content[z].toString() + '\n';
		             }*/
		          //////////////////////////////////////////////////////////////////////////////////////////
		          var data='';
		      	var row_product = new Array();
		      	var headers=new Array();
		      	for(var ph=0;ph<columns.length;ph++){
		      		headers[headers.length]=columns[ph].label;
		      		log.debug('headers[headers.length] ',headers[headers.length]);
		      	}
		      	data += headers + '\n';
		      	var resultset = mySearch.run();
                var results = resultset.getRange(0, 999);
		      	for(var i=0;i<results.length;i++){

		      		var cols=results[i].columns;
		      		log.debug('cols ',cols);
		      		for(var j=0;j<headers.length;j++){
		      		
		      				row_product[j] =""+results[i].getValue(cols[j])+"";
		      				log.debug('row_product[j] ',row_product[j]);
		      		}
		      	
		      	
		      		data += row_product + '\n';
		      		log.debug('data row product',data);
		      	}
		      	var data='';
		          for(var z =0; z<data.length;z++){
		        	  data +=data[z].toString() + '\n';
		             }
		          //////////////////////////////////////////////////////////////////////////////////////////////
		           
		            
		         //   log.debug('contents in second for loop',contents);
		            var fileObj = file.create({
		                name: 'testsearchcsv.csv',
		                fileType: file.Type.CSV,
		                contents: data
		               });
		               
		       // } 
		     
			//	}
	////////////////////////////////////Sandbox Credentils//////////////////////////////////////////////
    //	var myPwdGuid = "a40fd0f35ffb46d3b6a75731b03dcdcf";
     //  var myHostKey = "AAAAB3NzaC1yc2EAAAADAQABAAABAQDTPIS7GE9cpFCm2lR8sGvgkoPLMoUQ0ifA+NH9mDxf7RuyqLeE67eX1wq/eyscLIgRBD3SJ2gzMEDTfQMOt2YhK7N8pFF05fbMrFGEILckNXifFbvyiZxt7A9CFG2t6xg5CpESQxjOaMvrJKcPqxhoeOdbbF7xOnAt/rQ6jbhIGc7uH+HErS8St0RTGtVRwy5/lV/ymK64e1Zthwmy6pZfbtvvM3X/RcKYiO3QR85NBqrHrOLz1ezRpxB8EdTfIoIsggPu7DK0/kLdfg1psv6T0CzodA1CDfL27+IJkySzId03rdrL4wmok/EjdFNLBoHyty18NYZdUYvUy34vyXdT"
      //  var myPwdGuid = "b8e08eee67d044c8940db2ea72a15d51";
		//var myHostKey ="AAAAB3NzaC1yc2EAAAABIwAAAQEAzZxy+tYJEBFEx5phpKNdSEEWK9x3+hwutjWk57/8Vcmmny+wtNyj8LZA0NNre8Zj6w9If1jBRoTjRFfTm/A08Ws67OenRilIGMpp42+B1yHwU5S7I57vQgQuPOjKu78/ZfzJU/XJkBVuXQmxVRAF0XiqjUQv2bLxFFs1Oh+a29tlyHrRWJZOs55g+a4voSBS/aJedZc9F5R9LtJ4dYbndauFppM51qJsqQdMsHIwOcCoaepRmPcWnhJ1y2YYI8LRPHljYnzcKJhL4huUIN4KYakpJfW8L9rdy9WtbyudKCnfINDa9oHE6PGTP1oXDLkY4/1Fh0/90Auqmc1tonNU/w==";
    ///////////////////////////////////////Production Credentails/////////////////////////////////////    	
        var myPwdGuid =  "17755b7fd1624f41a7561f8a294b0a1a";
        var myHostKey = "AAAAB3NzaC1yc2EAAAADAQABAAABAQDTPIS7GE9cpFCm2lR8sGvgkoPLMoUQ0ifA+NH9mDxf7RuyqLeE67eX1wq/eyscLIgRBD3SJ2gzMEDTfQMOt2YhK7N8pFF05fbMrFGEILckNXifFbvyiZxt7A9CFG2t6xg5CpESQxjOaMvrJKcPqxhoeOdbbF7xOnAt/rQ6jbhIGc7uH+HErS8St0RTGtVRwy5/lV/ymK64e1Zthwmy6pZfbtvvM3X/RcKYiO3QR85NBqrHrOLz1ezRpxB8EdTfIoIsggPu7DK0/kLdfg1psv6T0CzodA1CDfL27+IJkySzId03rdrL4wmok/EjdFNLBoHyty18NYZdUYvUy34vyXdT";
        	var connection = sftp.createConnection({username: 'admin470',passwordGuid: myPwdGuid, url: '24.155.93.123', directory: '/home/admin470', hostKey: myHostKey, port: 55236});
      //  var connection = sftp.createConnection({username: '470Claims.prod',passwordGuid: myPwdGuid, url: 'xwftp.xactware.com', directory: '/Out/boomi', hostKey: myHostKey, port: 22});
	 log.debug({ title: 'connection', details: connection});
	//var myFileToUpload = file.create({name: 'file.txt',fileType: file.Type.PLAINTEXT,contents: 'This is uploaded using sftp API in SuiteScript 2.0'});
	log.debug({ title: 'fileObj', details: fileObj});
	connection.upload({file: fileObj, directory: '/Downloads',filename: 'testsearchcsv.csv',replaceExisting: true});
	
    }
 
    return {
        execute: execute
    };
    
});
