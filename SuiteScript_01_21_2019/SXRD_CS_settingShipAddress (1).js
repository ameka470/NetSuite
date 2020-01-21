/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Dec 2017     TG Mounika
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum){
	/*if(name === 'custbody8')		//representing on which particular fields the action needs be execute 
	{
		var contactId=nlapiGetFieldValue("custbody8");
		log.debug("contactId",contactId);
		if(contactId){
			var custRec=nlapiLoadRecord("contact",contactId);
			var count=custRec.getLineItemCount("addressbook");
			log.debug("count",count);
			if(count){
				for(var loop=1;loop<=count;loop++){
					var defaultAddress=custRec.getLineItemValue("addressbook","defaultshipping",loop);
					log.debug("defaultAddress",defaultAddress);
					if(defaultAddress == 'T'){
					var shipAddress=custRec.getLineItemValue("addressbook","addrtext",loop);
					log.debug("shipAddress",shipAddress);

					}
					}
				nlapiSetFieldValue("shipaddress",shipAddress);
			}
		}else{
			nlapiSetFieldValue("shipaddress"," ");
		}
		
	}*/
	if(name == 'entity'){
		var customer=nlapiGetFieldValue("entity");
		log.debug("customer",customer);
		if(customer){ 
			var addr=nlapiGetFieldValue('shipaddresslist');
			log.debug("addr",addr);
			 if(addr){
				 log.debug("entered");
				 nlapiSetFieldValue("shipaddresslist",'');
			 }else{
                nlapiSetFieldValue("shipaddresslist",'');
             }
			 }
		 else{
			 log.debug("if2");
			 nlapiSetFieldValue("shipaddresslist",'');
		 }
		
   }
}
