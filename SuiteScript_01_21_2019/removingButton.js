/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget'],
		/**
		 * @param {serverWidget} serverWidget
		 */
		function(serverWidget) {

	/**
	 * Function definition to be triggered before record is loaded.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {string} scriptContext.type - Trigger type
	 * @param {Form} scriptContext.form - Current form
	 * @Since 2015.2
	 */
	function beforeLoad(scriptContext) {
		try{
		 var form = scriptContext.form ;
		var claimRecord=scriptContext.newRecord;
		log.debug("claimRecord",claimRecord);
		var status=claimRecord.getValue({fieldId:'status'});
		log.debug("status",status);
	if( scriptContext.type == 'view' || status == 'Pending Billing'){
		if (scriptContext.type == 'view') {
		             form.removeButton({
		               id :'billremaining'
		              });
		             form.removeButton({
			               id :'process'
			              });
		             form.removeButton({
			               id :'createdeposit'
			              });
			              form.removeButton({
				               id :'nextbill'
				              });
		}   
		}
	if (scriptContext.type == 'edit'){

			var newItemArray=new Array();
			var lineCount=claimRecord.getLineCount({sublistId: 'item'});
			log.debug("lineCount",lineCount);
			for(var loop=0;loop<lineCount;loop++){
				var checkboxValue = claimRecord.getSublistValue({
					sublistId: 'item',
					fieldId: 'custcol_259_billed',
					line:loop
				});
				log.debug("checkboxValue",checkboxValue);
				if(checkboxValue == true){
					//log.debug("j",j);
					/*log.debug("entered check");
					newItemArray.push(loop);
					log.debug("newItemArray",newItemArray);	*/
				 //var quantityField = form.getSublist({id: 'item'}).getField({id: 'quantity'});
					
					var objField = claimRecord.getSublistField({
					    sublistId: 'item',
					    fieldId: 'quantity',
					    line: loop
					});
					log.debug("quantityField",quantityField);
					objField.updateDisplayType({
					    displayType :'disabled'
					});
					
				}else{
					var quantityField = form.getSublist({id: 'item'}).getField({id: 'quantity'});
					log.debug("quantityField",quantityField);
					quantityField.updateDisplayType({
					    displayType : serverWidget.FieldDisplayType.ENTRY
					});
				}
			}
			for(var iteration=0;iteration<newItemArray.length;iteration++){
				var quantityField =claimRecord.getSublistField({
				    sublistId: 'item',
				    fieldId: 'quantity',
				    line:iteration
				});
				log.debug("quantityField",quantityField);
				var type=quantityField.isDisabled;
				log.debug("type",type);
			}
			}
		}
		catch(error){
			log.debug(error);
		}
	}

	/**
	 * Function definition to be triggered before record is loaded.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {Record} scriptContext.oldRecord - Old record
	 * @param {string} scriptContext.type - Trigger type
	 * @Since 2015.2
	 */
	function beforeSubmit(scriptContext) {

	}

	/**
	 * Function definition to be triggered before record is loaded.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {Record} scriptContext.oldRecord - Old record
	 * @param {string} scriptContext.type - Trigger type
	 * @Since 2015.2
	 */
	function afterSubmit(scriptContext) {

	}

	return {
		beforeLoad: beforeLoad,
		beforeSubmit: beforeSubmit,
		afterSubmit: afterSubmit
	};
	
});
