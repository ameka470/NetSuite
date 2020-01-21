/**
 *
 *
 */


function set_shipto(type){

	try{


		if(type=='edit'){
			var oldrec=nlapiGetOldRecord();
		   var old_cus=oldrec.getFieldValue('entity');
			 nlapiLogExecution('debug','old_cus',old_cus);
			var rec=nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId(),{recordmode: 'dynamic'});
           var newCus=rec.getFieldValue('entity');
					 if(old_cus=='23520' && old_cus!=newCus ){
						 var address=rec.getFieldValue('custbody_shipp_address');
						 nlapiLogExecution('debug','address',address);
						 if(address!=null && address!=''){
							 address=JSON.parse(address);
							  nlapiLogExecution('debug','city',address.city);
								rec.setFieldValue('shipaddresslist', "");
	 						var addrSubrecord=rec.createSubrecord('shippingaddress');
	 						addrSubrecord.setFieldValue('country', address.country);
	 						addrSubrecord.setFieldValue('isresidential', 'F');
	 						//addrSubrecord.setFieldValue('attention', 'Shipping Address');
	 					//	addrSubrecord.setFieldValue('shipaddressee', shipaddressee);
	 						addrSubrecord.setFieldValue('addr1',address.addr1);
	 					//	addrSubrecord.setFieldValue('addr2', 'add2');
	 					//	addrSubrecord.setFieldValue('addr3',' add3');
	 						addrSubrecord.setFieldValue('city', address.city);
	 						addrSubrecord.setFieldValue('state', address.state); //
	 						addrSubrecord.setFieldValue('zip', address.zip);
	 						addrSubrecord.commit();
	 						nlapiSubmitRecord(rec, false, true)
						 }

					 }
					 ;

		}

	}	catch (e) {

		nlapiLogExecution('DEBUG', 'ERROR', e.message);

    }
}
