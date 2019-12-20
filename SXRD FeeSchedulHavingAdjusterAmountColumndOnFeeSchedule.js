/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/**
 * Script Type          : CLIENT Script
 * Script Name          : SXRD_CS_feeSchedule.js
 * Version              : 2.0
 * Author               : T.G.Mounika
 * Start Date           : 29/11/2017
 * Last Modified Date   : 05/12/2017
 * Description          : Calculating fee schedule amount and adjuster amount.
 */
define(['N/currentRecord','N/search','N/record'],

    function(currentRecord,search,record) {

  var recObject = currentRecord.get();
  var name=new Array();
  var checkingIsClosed=new Array();
  /**
     * Function to be executed after clicking 'Calculate fee schedule amount' button.
     *
     * Gets the 'Fee schedule' and 'Gross Loss amount', amount ranges from fee schedule.
     *
     * Checks first line for fee schedule item,if not there, then add fee schedule item with amount based on 'Gross loss' amount.
     *
     * Checks every line except first line, for fee schedule item.
     * If there, then update the amount if 'Gross loss' amount is changed or amount range in fee schedule is changed.
     * If not there, then add fee schedule item with amount based on 'Gross loss' amount.
     *
     */

  function feeScheduleAmount()
  {
    try{
    var feeScheduleId =  recObject.getValue({		//Getting schedule and and the invoice gross loss values
      fieldId: 'custbody_sxrd_fee_schedule'
    });
    if(feeScheduleId){
      var grossValue =  recObject.getValue({
        fieldId: 'custbody_sxrd_invoice_gross_loss'
      });
      var customrecord=record.load({					//Retrieving the amount ranges from custom record and setting the amount,item values in line level
        type: 'customrecord_sxrd_fee_schedule',
        id: feeScheduleId
      });
      var lineCount=customrecord.getLineCount({
        sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent'
      });
      var lineNo=recObject.getLineCount({sublistId: 'item'});

      //alert("lineNo " + lineNo);
      //else{
        for (var i = 0; i < lineNo; i++) {		//Checks for fee schedule item in every line item
          var itemLineNO=recObject.selectLine({sublistId:'item',line:i});
          //alert("i"+ i);
           name[i] = recObject.getCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'item',
            line:i
          });
          //alert("name "+ name);
           checkingIsClosed[i]=recObject.getCurrentSublistValue
            ({
              sublistId: 'item',
              fieldId: 'isclosed'
            });
            //alert("checkingIsClosed"+checkingIsClosed);
        }
        //var scheduleItem=7;
        var itemIndex=name.lastIndexOf("138");
        //alert("itemIndex"+itemIndex);
        //alert("index based:"+checkingIsClosed[itemIndex]);
        if(itemIndex == -1){		//Add fee schedule item and it's amount if item is not there

          recObject.selectNewLine({
          sublistId: 'item'
        });
        recObject.setCurrentSublistValue
        ({
          sublistId: 'item',
          fieldId: 'item',
          value :138,
          ignoreFieldChange: true
        });
          recObject.setCurrentSublistValue
          ({
            sublistId: 'item',
            fieldId: 'quantity',
            value :1,
            ignoreFieldChange: true
          });
          for(var j=0;j<lineCount;j++){
            var fromAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_from',line: j});
            //alert("fromAmount"+fromAmount);
            var toAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amount',line: j});
            //alert("toAmount"+toAmount);
        if(toAmount){
            if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
              var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
								//alert("amountpercent"+amountpercent);
								var minValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_min',line: j});
								//alert("minValue"+minValue);
								var maxValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_max',line: j});
								//alert("maxValue"+maxValue);
								var amountToSet=(amountpercent/100)*grossValue;
								//alert("amountToSet"+amountToSet);
								if(minValue != '' || maxValue != ''){
									//alert('entered into my field3');
									//log.debug("entered into my field3",toAmount);
									var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
									//alert("amountpercent"+amountpercent);
									var minValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_min',line: j});
									//alert("minValue"+minValue);
									var maxValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_max',line: j});
									//alert("maxValue"+maxValue);
									var amountToSet=(amountpercent/100)*grossValue;
									//alert("amountToSet"+amountToSet);
								if(minValue != '' && maxValue != ''){
											if(amountToSet <= minValue){
												//alert("min value case");
												var totalAmount=recObject.setCurrentSublistValue
												({
													sublistId: 'item',
													fieldId: 'rate',
													value : minValue
												});
												recObject.commitLine({sublistId: 'item'});
											}
											else if(amountToSet >= maxValue){
												//alert("max value case");
												var totalAmount=recObject.setCurrentSublistValue
												({
													sublistId: 'item',
													fieldId: 'rate',
													value : maxValue
												});
												recObject.commitLine({sublistId: 'item'});
											}
											else{
												//alert("other value case");
												var totalAmount=recObject.setCurrentSublistValue
												({
													sublistId: 'item',
													fieldId: 'rate',
													value : amountToSet
												});
												recObject.commitLine({sublistId: 'item'});
											}
										}
									if(minValue == '' && maxValue != ''){
									//alert("entered else");
									if(amountToSet >= maxValue ){
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : maxValue
										});
										recObject.commitLine({sublistId: 'item'});
									}
									else{
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : amountToSet
										});
										recObject.commitLine({sublistId: 'item'});
									}
								}
								else if(minValue != '' && maxValue==''){
									if(amountToSet <= minValue ){
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : minValue
										});
										//alert("amountToSet <= minValue")
										recObject.commitLine({sublistId: 'item'});
									}
									else{
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : amountToSet
										});
										recObject.commitLine({sublistId: 'item'});
									}
								}
									if(minValue == '' && maxValue==''){
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : amountToSet
										});
										recObject.commitLine({sublistId: 'item'});
									}
								}else{
              var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
              //alert("amountpercent"+amountpercent);
              var totalAmount=recObject.setCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'rate',
                value : amountpercent
              });
              break;
            }
        }
      }
            else{
              var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
              //alert("amountpercent"+amountpercent);
              var minValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_min',line: j});
              //alert("minValue"+minValue);
              var maxValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_max',line: j});
              //alert("maxValue"+maxValue);
              var amountToSet=(amountpercent/100)*grossValue;
              //alert("amountToSet"+amountToSet);
            if(minValue != '' && maxValue != ''){
                  if(amountToSet <= minValue){
                    //alert("min value case");
                    var totalAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'rate',
                      value : minValue
                    });
                  }
                  else if(amountToSet >= maxValue){
                    //alert("max value case");
                    var totalAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'rate',
                      value : maxValue
                    });
                  }
                  else{
                    //alert("other value case");
                    var totalAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'rate',
                      value : amountToSet
                    });
                  }
                }
              if(minValue == '' && maxValue != ''){
              //alert("entered else");
              if(amountToSet >= maxValue ){
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : maxValue
                });
              }
              else{
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : amountToSet
                });
              }
            }
            else if(minValue != '' && maxValue==''){
              if(amountToSet <= minValue ){
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : minValue
                });
              }
              else{
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : amountToSet
                });
              }
            }
              if(minValue == '' && maxValue==''){
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : amountToSet
                });
              }
            }
            }
          recObject.commitLine({sublistId: 'item'});
        }
        else {			//If fee schedule item is there,update the amount value
          if(checkingIsClosed[itemIndex] == true){
            //Add fee schedule item and it's amount if item is not there
            //[itemName.indexOf(items[set])]
            recObject.selectNewLine({
              sublistId: 'item'
            });
            recObject.setCurrentSublistValue
            ({
              sublistId: 'item',
              fieldId: 'item',
              value :138,
              ignoreFieldChange: true
            });
            recObject.setCurrentSublistValue
            ({
              sublistId: 'item',
              fieldId: 'quantity',
              value :1,
              ignoreFieldChange: true
            });
            for(var j=0;j<lineCount;j++){
              var fromAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_from',line: j});
              //alert("fromAmount"+fromAmount);
              var toAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amount',line: j});
              //alert("toAmount"+toAmount);
          if(toAmount){
              if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
                var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
                //alert("amountpercent"+amountpercent);
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : amountpercent
                });
                break;
              }
          }
              else {
                var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
                //alert("amountpercent"+amountpercent);
                var minValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_min',line: j});
                //alert("minValue"+minValue);
                var maxValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_max',line: j});
                //alert("maxValue"+maxValue);
                var amountToSet=(amountpercent/100)*grossValue;
                //alert("amountToSet"+amountToSet);
          if(minValue != '' && maxValue != ''){
                  if(amountToSet <= minValue){
                    //alert("min value case");
                    var totalAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'rate',
                      value : minValue
                    });
                  }
                  else if(amountToSet >= maxValue){
                    //alert("max value case");
                    var totalAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'rate',
                      value : maxValue
                    });
                  }
                  else{
                    //alert("other value case");
                    var totalAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'rate',
                      value : amountToSet
                    });
                  }
                }
              if(minValue == '' && maxValue != ''){
              //alert("entered else");
              if(amountToSet >= maxValue ){
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : maxValue
                });
              }
              else{
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : amountToSet
                });
              }
            }
            else if(minValue != '' && maxValue==''){
              if(amountToSet <= minValue ){
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : minValue
                });
              }
              else{
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : amountToSet
                });
              }
            }
              if(minValue == '' && maxValue==''){
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value : amountToSet
                });
              }
              }
              }
            recObject.commitLine({sublistId: 'item'});

          }
          else{
          for(var j=0;j<lineCount;j++){
            var fromAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_from',line: j});
            //alert("fromAmount"+fromAmount);
            var toAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amount',line: j});
            //alert("toAmount"+toAmount);
        //if(toAmount){
            if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
              var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
								//alert("Third Else Part:amountpercent"+amountpercent);
								var minValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_min',line: j});
								//alert("Third Else PartminValue"+minValue);
								var maxValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_max',line: j});
								//alert("Third Else PartmaxValue"+maxValue);
								var amountToSet=(amountpercent/100)*grossValue;
								//alert("Third Else PartamountToSet"+amountToSet);
								if(minValue != '' || maxValue != ''){
									//alert('Third Else Partentered into my field3');
									//log.debug("Third Else Partentered into my field3",toAmount);
									var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
									//alert("amountpercent"+amountpercent);
									var minValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_min',line: j});
									//alert("minValue"+minValue);
									var maxValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_max',line: j});
									//alert("maxValue"+maxValue);
									var amountToSet=(amountpercent/100)*grossValue;
									//alert("amountToSet"+amountToSet);
								if(minValue != '' && maxValue != ''){
									//alert("minValue != '' && maxValue != ");
											if(amountToSet <= minValue){
												//alert("min value case");
												var totalAmount=recObject.setCurrentSublistValue
												({
													sublistId: 'item',
													fieldId: 'rate',
													value : minValue
												});
												//alert('amountToSet <= minValue');
											}
											else if(amountToSet >= maxValue){
												//alert("max value case");
												var totalAmount=recObject.setCurrentSublistValue
												({
													sublistId: 'item',
													fieldId: 'rate',
													value : maxValue
												});
												//alert('amountToSet >= maxValue');
											}
											else{
												//alert("other value case");
												var totalAmount=recObject.setCurrentSublistValue
												({
													sublistId: 'item',
													fieldId: 'rate',
													value : amountToSet
												});
											}
										}
									if(minValue == '' && maxValue != ''){
									//alert("entered else");
									if(amountToSet >= maxValue ){
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : maxValue
										});
									}
									else{
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : amountToSet
										});
									}
								}
								else if(minValue != '' && maxValue==''){
									//alert("minValue != '' && maxValue==");
									if(amountToSet <= minValue ){
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : minValue
										});
										//alert('amountToSet <= minValue ')
									}
									else{
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : amountToSet
										});
										//alert('else');
									}
								}
									if(minValue == '' && maxValue==''){
										var totalAmount=recObject.setCurrentSublistValue
										({
											sublistId: 'item',
											fieldId: 'rate',
											value : amountToSet
										});
									}
								}else{
              var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
              //alert("amountpercent"+amountpercent);
              recObject.selectLine({sublistId: 'item',line: itemIndex});
              var totalAmount=recObject.setCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'rate',
                line:itemIndex,
                value : amountpercent
              });
              recObject.commitLine({sublistId: 'item'});
            }

        }
            else if((fromAmount<=grossValue)&&(toAmount == '')){
              //alert("entered else case");
              var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
              //alert("amountpercent"+amountpercent);
              var minValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_min',line: j});
              //alert("minValue"+minValue);
              var maxValue=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_max',line: j});
              //alert("maxValue"+maxValue);
              var amountToSet=(amountpercent/100)*grossValue;
              //alert("amountToSet"+amountToSet);
                    if(minValue != '' && maxValue != ''){
                if(amountToSet <= minValue){
                //alert("min value case");
                recObject.selectLine({sublistId: 'item',line: itemIndex});
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  line:itemIndex,
                  value : minValue
                });
                recObject.commitLine({sublistId: 'item'});
              }
              else if(amountToSet >= maxValue){
                //alert("max value case");
                recObject.selectLine({sublistId: 'item',line: itemIndex});
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  line:itemIndex,
                  value : maxValue
                });
                recObject.commitLine({sublistId: 'item'});
              }
              else{
                //alert("other value case");
                recObject.selectLine({sublistId: 'item',line: itemIndex});
                var totalAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  line:itemIndex,
                  value : amountToSet
                });
                recObject.commitLine({sublistId: 'item'});
              }
              }
            if(minValue == '' && maxValue != ''){
            //alert("entered else");
            if(amountToSet >= maxValue ){
              recObject.selectLine({sublistId: 'item',line: itemIndex});
              var totalAmount=recObject.setCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'rate',
                line:itemIndex,
                value : maxValue
              });
              recObject.commitLine({sublistId: 'item'});
            }
            else{
              recObject.selectLine({sublistId: 'item',line: itemIndex});
              var totalAmount=recObject.setCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'rate',
                line:itemIndex,
                value : amountToSet
              });
              recObject.commitLine({sublistId: 'item'});
            }
          }
          else if(minValue != '' && maxValue==''){
            if(amountToSet <= minValue ){
              recObject.selectLine({sublistId: 'item',line: itemIndex});
              var totalAmount=recObject.setCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'rate',
                line:itemIndex,
                value : minValue
              });
              recObject.commitLine({sublistId: 'item'});
            }
            else{
              recObject.selectLine({sublistId: 'item',line: itemIndex});
              var totalAmount=recObject.setCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'rate',
                line:itemIndex,
                value : amountToSet
              });
              recObject.commitLine({sublistId: 'item'});
            }
          }
            if(minValue == '' && maxValue==''){
              recObject.selectLine({sublistId: 'item',line: itemIndex});
              var totalAmount=recObject.setCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'rate',
                line:itemIndex,
                value : amountToSet
              });
              recObject.commitLine({sublistId: 'item'});
            }
              //}
            }
            }
        }
        }
      //}
    }
    else{
      alert("Please enter a value for Fee Fchedule");
    }

  }catch(error){
    log.debug("error",error);
  }
  }


  /**
     * Function to be executed after clicking 'Calculate Adjuster commission' button.
     *
     * Checks every line for overide commission percent,if there, then checks full commission field.
     * If full commission is true,then set the adjuster amount value to amount.
     * If full commission is false,then calculates amount and overide commission percent, and set in adjuster amount field.
     *
     * If overide commission percent is not there, then checks adjuster commission percent of corresponding fee schedule and full commission field.
     * If full commission is true,then set the adjuster amount value to amount.
     * If full commission is false,then calculates amount and adjuster commission percent, and set in adjuster amount field.
     *
     * If adjuster commission percent is not there, then checks adjuster commission percent in corresponding vendor record and full commission field.
     * If full commission is true,then set the adjuster amount value to amount.
     * If full commission is false,then calculates amount and adjuster commission percent, and set in adjuster amount field.
     */

  function adjusterCommission()
  {
    try{
    var lineCount=recObject.getLineCount({
      sublistId: 'item'
    });
    if(lineCount){
      for(var i=0;i<lineCount;i++){
        var lineNo=recObject.selectLine({sublistId:'item',line:i});

        var adjusterCommissionPercent=recObject.getCurrentSublistValue
        ({
          sublistId: 'item',
          fieldId: 'custcol_sxrd_override_adj_comm'					// OverideCommision % on claim
        });
        //alert("adjusterCommissionPercent",adjusterCommissionPercent);
        var checkingIsClosed=recObject.getCurrentSublistValue
        ({
          sublistId: 'item',
          fieldId: 'isclosed'
        });
        //alert("checkingIsClosed"+checkingIsClosed);
        var itemID=recObject.getCurrentSublistValue
        ({
          sublistId: 'item',
          fieldId: 'item'
        });
        //alert("itemID"+itemID);
        var noCommission=search.lookupFields({
              type: search.Type.SERVICE_ITEM,
              id: itemID,
              columns: ['custitem_sxrd_no_commission_2','custitem_sxrd_full_commission']
          });
          var noCommissionValue=noCommission.custitem_sxrd_no_commission_2;
          //alert("noCommissionValue"+noCommissionValue);
                var fullCommissionValue=noCommission.custitem_sxrd_full_commission;
          //alert("fullCommissionValue:"+fullCommissionValue);
          /*if(noCommissionValue == true){
            if(checkingIsClosed == false){
              var lineNo=recObject.selectLine({sublistId:'item',line:i});
              var adjusterAmount=recObject.setCurrentSublistValue
            ({
              sublistId: 'item',
              fieldId: 'custcol_sxrd_adjustor_amount',
              value : 0
            });
            }
          }
        else{*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var feeScheduleId =  recObject.getValue({		//Getting schedule and and the invoice gross loss values
                    fieldId: 'custbody_sxrd_fee_schedule'
                  });
                var grossValue =  recObject.getValue({
                    fieldId: 'custbody_sxrd_invoice_gross_loss'
                  });
                  if(feeScheduleId){
                    var customrecord=record.load({type: 'customrecord_sxrd_fee_schedule',id: feeScheduleId});//Retrieving the amount ranges from custom record and setting the amount,item values in line level
                    var lineCount1=customrecord.getLineCount({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent'});  
                    var customrecord=record.load({type: 'customrecord_sxrd_fee_schedule',id: feeScheduleId});
                   		// alert("customrecord"+customrecord);
                    for(var j=0;j<lineCount1;j++){
                        var fromAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_from',line: j});
                       // alert("fromAmount"+fromAmount);
                        var toAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amount',line: j});
                       // alert("toAmount"+toAmount);
                      //  if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
                       
                        var billPercentage=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_percentage',line: j});
                      //  alert("billPercentage1"+billPercentage);
                        if(toAmount){
                        //	alert("entered to amount")
                            if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
                            	 var billAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_amount',line: j});
                          //       alert("billAmount1:"+billAmount);
                        if(billAmount != ''){ 
                        	 if(checkingIsClosed == false){
                        	if(billAmount != '' && billPercentage != ''){
                        		alert("Please check fee schdule amount and percentage");
                        		break;
                        	}else{
                        	var billAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_amount',line: j});
                        //    alert("billAmount2:"+billAmount);
                      	  var adjusterAmount=recObject.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_sxrd_adjustor_amount',value : billAmount});
                        	//}
                        
                            break; 
                        	}
                        }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            }else {
                            	if(adjusterCommissionPercent){
            if(checkingIsClosed == false){
              var lineNo=recObject.selectLine({sublistId:'item',line:i});
              var fullCommission=recObject.getCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'custcol_sxrd_100_commision'
              });
              //alert("fullCommission"+fullCommission);
              var amt=recObject.getCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'amount'
              });
              //alert("amt"+amt);
              //alert("(adjusterCommissionPercent/"+(adjusterCommissionPercent/100)*amt);
               if(fullCommission == false){		//If full commission box is not checked,then set adjuster amount field by multiplying commission percent and amount,otherwise set amount
                 if(fullCommissionValue == true){
                                      // alert("true");
                   var adjusterAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'custcol_sxrd_adjustor_amount',
                      value : amt
                    });
                 }else if(noCommissionValue == true){
                      //if(checkingIsClosed == false){
                        //var lineNo=recObject.selectLine({sublistId:'item',line:i});
                        var adjusterAmount=recObject.setCurrentSublistValue
                      ({
                        sublistId: 'item',
                        fieldId: 'custcol_sxrd_adjustor_amount',
                        value : 0
                      });
                      //}
                    }else{
                                    // alert("false");
                   var adjusterAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'custcol_sxrd_adjustor_amount',
                      value : (adjusterCommissionPercent/100)*amt
                    });
                 }
              }
              else{
                var adjusterAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'custcol_sxrd_adjustor_amount',
                  value : amt
                });
              }
            }


          }else{
          //alert("entered first else");
          var overrideAdjusterCommission =  recObject.getValue({			//Retrieves the adjuster commission value from salesorder
            fieldId: 'custbody_sxrd_override_adj_comm'
          });
                       // alert(overrideAdjusterCommission);
          if(overrideAdjusterCommission){
            if(checkingIsClosed == false){
              var lineNo=recObject.selectLine({sublistId:'item',line:i});
              var fullCommission=recObject.getCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'custcol_sxrd_100_commision'
              });
              var amt=recObject.getCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'amount'
              });
              if(fullCommission == false){		//If full commission box is not checked,then set adjuster amount field by multiplying commission percent and amount,otherwise set amount
                 if(fullCommissionValue == true){
                                    //   alert("true:line 862");
                   var adjusterAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'custcol_sxrd_adjustor_amount',
                      value : amt
                    });
                 }else if(noCommissionValue == true){
                      //if(checkingIsClosed == false){
                        //var lineNo=recObject.selectLine({sublistId:'item',line:i});
                        var adjusterAmount=recObject.setCurrentSublistValue
                      ({
                        sublistId: 'item',
                        fieldId: 'custcol_sxrd_adjustor_amount',
                        value : 0
                      });
                      //}
                    }else{
                                 //   alert("false:line 880");
                   var adjusterAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'custcol_sxrd_adjustor_amount',
                      value : (overrideAdjusterCommission/100)*amt
                    });
                 }
              }
              else{
                var adjusterAmount=recObject.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'custcol_sxrd_adjustor_amount',
                  value : amt
                });
              }
            }
            }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         else if(billPercentage != ''){
        	 if(checkingIsClosed == false){
        	  var billPercentage=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_percentage',line: j});
         //     alert("billPercentage"+billPercentage);
              var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
				//alert("amountpercent"+amountpercent);
              var amt=recObject.getCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'amount'
              });
              if(toAmount){
                  if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
                	  if(billPercentage != ''){ 
                	  var billPercentage=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_percentage',line: j});
                    //  alert("billPercentage"+billPercentage);
                      adjusterAmountToSet= (billPercentage/100)*amt;
                      //              	 alert("adjusterAmountToSet"+adjusterAmountToSet);
                                  	  var adjusterAmount=recObject.setCurrentSublistValue
                      					({
                      						sublistId: 'item',
                      						fieldId: 'custcol_sxrd_adjustor_amount',
                      						value : adjusterAmountToSet
                      					}); 
                                  	  break;
                  }else{
                	  	if(overrideAdjusterCommission==''){
                  //      alert("entered second second else");//If there is no override commission in SO,get the value from vendor record
                	  		
                        var vendorId=recObject.getValue({
                          fieldId: 'custbody_sxrd_adjuster'
                        });
                       // alert("vendorId:"+vendorId);
                        var vendorRecord= search.lookupFields({
                          type: search.Type.VENDOR,
                          id: vendorId,
                          columns: ['custentity_sxrd_adjustor_commission']
                        });
                        var commission=vendorRecord.custentity_sxrd_adjustor_commission;
                                    //alert(commission);
                        if(commission){
                          if(checkingIsClosed == false){
                            var lineNo=recObject.selectLine({sublistId:'item',line:i});
                            var fullCommission=recObject.getCurrentSublistValue
                            ({
                              sublistId: 'item',
                              fieldId: 'custcol_sxrd_100_commision'
                            });
                            var amt=recObject.getCurrentSublistValue
                          ({
                            sublistId: 'item',
                            fieldId: 'amount'
                          });
                    //        alert("amt:1237:"+amt);
                            if(fullCommission == false){		//If full commission box is not checked,then set adjuster amount field by multiplying commission percent and amount,otherwise set amount
                               if(fullCommissionValue == true){
                                                 // alert("true");
                               var adjusterAmount=recObject.setCurrentSublistValue
                                ({
                                  sublistId: 'item',
                                  fieldId: 'custcol_sxrd_adjustor_amount',
                                  value : amt
                                });
                             }else if(noCommissionValue == true){
                                  //if(checkingIsClosed == false){
                                    var lineNo=recObject.selectLine({sublistId:'item',line:i});
                                    var adjusterAmount=recObject.setCurrentSublistValue
                                  ({
                                    sublistId: 'item',
                                    fieldId: 'custcol_sxrd_adjustor_amount',
                                    value : 0
                                  });
                                  //}
                                }else{
                                               // alert("false");
                                                // alert((parseFloat(commission)/100)*amt);
                               var adjusterAmount=recObject.setCurrentSublistValue
                                ({
                                  sublistId: 'item',
                                  fieldId: 'custcol_sxrd_adjustor_amount',
                                  value : (parseFloat(commission)/100)*amt
                                });
                             }
                            }
                            else{
                              var adjusterAmount=recObject.setCurrentSublistValue
                              ({
                                sublistId: 'item',
                                fieldId: 'custcol_sxrd_adjustor_amount',
                                value : amt
                              });
                            }
                          }

                        }
                      }
                  }
                  }
                  }else{
                	  adjusterAmountToSet= (billPercentage/100)*amt;
                      //           //   	 alert("adjusterAmountToSet"+adjusterAmountToSet);
                                  	  var adjusterAmount=recObject.setCurrentSublistValue
                      					({
                      						sublistId: 'item',
                      						fieldId: 'custcol_sxrd_adjustor_amount',
                      						value : adjusterAmountToSet
                      					}); 
                                  	break;
                  }
          }
          }              
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////          
           else if(overrideAdjusterCommission == ''){
       //     alert("entered second else");//If there is no override commission in SO,get the value from vendor record
            var vendorId=recObject.getValue({
              fieldId: 'custbody_sxrd_adjuster'
            });
           // alert("vendorId:"+vendorId);
            var vendorRecord= search.lookupFields({
              type: search.Type.VENDOR,
              id: vendorId,
              columns: ['custentity_sxrd_adjustor_commission']
            });
            var commission=vendorRecord.custentity_sxrd_adjustor_commission;
                        //alert(commission);
            if(commission){
              if(checkingIsClosed == false){
                var lineNo=recObject.selectLine({sublistId:'item',line:i});
                var fullCommission=recObject.getCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'custcol_sxrd_100_commision'
                });
                var amt=recObject.getCurrentSublistValue
              ({
                sublistId: 'item',
                fieldId: 'amount'
              });
                //alert("amt:"+amt);
                if(fullCommission == false){		//If full commission box is not checked,then set adjuster amount field by multiplying commission percent and amount,otherwise set amount
                   if(fullCommissionValue == true){
                                     // alert("true");
                   var adjusterAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'custcol_sxrd_adjustor_amount',
                      value : amt
                    });
                 }else if(noCommissionValue == true){
                      //if(checkingIsClosed == false){
                        var lineNo=recObject.selectLine({sublistId:'item',line:i});
                        var adjusterAmount=recObject.setCurrentSublistValue
                      ({
                        sublistId: 'item',
                        fieldId: 'custcol_sxrd_adjustor_amount',
                        value : 0
                      });
                      //}
                    }else{
                                   // alert("false");
                                    // alert((parseFloat(commission)/100)*amt);
                   var adjusterAmount=recObject.setCurrentSublistValue
                    ({
                      sublistId: 'item',
                      fieldId: 'custcol_sxrd_adjustor_amount',
                      value : (parseFloat(commission)/100)*amt
                    });
                 }
                }
                else{
                  var adjusterAmount=recObject.setCurrentSublistValue
                  ({
                    sublistId: 'item',
                    fieldId: 'custcol_sxrd_adjustor_amount',
                    value : amt
                  });
                }
              }

            }
          }
        }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                           // }  
                        }
                        }
                        
                    }else {
                    	var billAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_amount',line: j});
                    	 //var billPercentage=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_percentage',line: j});
                   // 	 alert("billPercentage"+billPercentage);
                    	 if(billAmount != ''){
                    		 if(checkingIsClosed == false){
                    		 if(billAmount != '' && billPercentage != ''){
                         		alert("Please check fee schdule amount and percentage");
                         		break;
                         	}else{
                         	var billAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_amount',line: j});
                           //  alert("billAmount2else"+billAmount);
                       	  var adjusterAmount=recObject.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_sxrd_adjustor_amount',value : billAmount});
                       	  break;
                         	}
                    	 }
                    	 }else {
                    		 if(adjusterCommissionPercent){
                    		//	 alert("adjusterCommissionPercent:"+adjusterCommissionPercent);
                             if(checkingIsClosed == false){
                            //	 alert("checkingIsClosed:"+checkingIsClosed);
                                 var lineNo=recObject.selectLine({sublistId:'item',line:i});
                                 var fullCommission=recObject.getCurrentSublistValue
                                 ({
                                   sublistId: 'item',
                                   fieldId: 'custcol_sxrd_100_commision'
                                 });
                                 //alert("fullCommission"+fullCommission);
                                 var amt=recObject.getCurrentSublistValue
                                 ({
                                   sublistId: 'item',
                                   fieldId: 'amount'
                                 });
                                 //alert("amt"+amt);
                                 //alert("(adjusterCommissionPercent/"+(adjusterCommissionPercent/100)*amt);
                                  if(fullCommission == false){		//If full commission box is not checked,then set adjuster amount field by multiplying commission percent and amount,otherwise set amount
                                    if(fullCommissionValue == true){
                                       //                   alert("true1123");
                                      var adjusterAmount=recObject.setCurrentSublistValue
                                       ({
                                         sublistId: 'item',
                                         fieldId: 'custcol_sxrd_adjustor_amount',
                                         value : amt
                                       });
                                    }else if(noCommissionValue == true){
                                         //if(checkingIsClosed == false){
                                           //var lineNo=recObject.selectLine({sublistId:'item',line:i});
                                           var adjusterAmount=recObject.setCurrentSublistValue
                                         ({
                                           sublistId: 'item',
                                           fieldId: 'custcol_sxrd_adjustor_amount',
                                           value : 0
                                         });
                                         //}
                                       }else{
                                     //                   alert("false1141");
                                      var adjusterAmount=recObject.setCurrentSublistValue
                                       ({
                                         sublistId: 'item',
                                         fieldId: 'custcol_sxrd_adjustor_amount',
                                         value : (adjusterCommissionPercent/100)*amt
                                       });
                                    }
                                 }
                                 else{
                                   var adjusterAmount=recObject.setCurrentSublistValue
                                   ({
                                     sublistId: 'item',
                                     fieldId: 'custcol_sxrd_adjustor_amount',
                                     value : amt
                                   });
                                 }
                               }


                             }else{
                      //       alert("entered first else:part 2");
                             var overrideAdjusterCommission =  recObject.getValue({			//Retrieves the adjuster commission value from salesorder
                               fieldId: 'custbody_sxrd_override_adj_comm'
                             });
                                          // alert(overrideAdjusterCommission);
                             if(overrideAdjusterCommission){
                        //    	 alert("overrideAdjusterCommission:1107"+overrideAdjusterCommission);
                               if(checkingIsClosed == false){
                            //	   alert("checkingIsClosed:1107"+checkingIsClosed);
                                 var lineNo=recObject.selectLine({sublistId:'item',line:i});
                                 var fullCommission=recObject.getCurrentSublistValue
                                 ({
                                   sublistId: 'item',
                                   fieldId: 'custcol_sxrd_100_commision'
                                 });
                                 var amt=recObject.getCurrentSublistValue
                                 ({
                                   sublistId: 'item',
                                   fieldId: 'amount'
                                 });
                                 if(fullCommission == false){		//If full commission box is not checked,then set adjuster amount field by multiplying commission percent and amount,otherwise set amount
                                //	 alert("fullCommission:1122"+fullCommission);
                                	 if(fullCommissionValue == true){
                                                          alert("true:line 1116");
                                      var adjusterAmount=recObject.setCurrentSublistValue
                                       ({
                                         sublistId: 'item',
                                         fieldId: 'custcol_sxrd_adjustor_amount',
                                         value : amt
                                       });
                                    }else if(noCommissionValue == true){
                                         //if(checkingIsClosed == false){
                                           //var lineNo=recObject.selectLine({sublistId:'item',line:i});
                                           var adjusterAmount=recObject.setCurrentSublistValue
                                         ({
                                           sublistId: 'item',
                                           fieldId: 'custcol_sxrd_adjustor_amount',
                                           value : 0
                                         });
                                         //}
                                       }else{
                                         //              alert("false:line 1135");
                                      var adjusterAmount=recObject.setCurrentSublistValue
                                       ({
                                         sublistId: 'item',
                                         fieldId: 'custcol_sxrd_adjustor_amount',
                                         value : (overrideAdjusterCommission/100)*amt
                                       });
                                    }
                                 }
                                 else{
                                   var adjusterAmount=recObject.setCurrentSublistValue
                                   ({
                                     sublistId: 'item',
                                     fieldId: 'custcol_sxrd_adjustor_amount',
                                     value : amt
                                   });
                                 }
                               }
                               }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                             
else if(billPercentage){
	
	//for(var j=0;j<lineCount1;j++){
	 // var fromAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_from',line: j});
      // alert("fromAmount"+fromAmount);
     //  var toAmount=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amount',line: j});
      // alert("toAmount"+toAmount);
//	alert("else if(billPercentage != ''),line :1158")
var billPercentage=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_percentage',line: j});
//alert("billPercentage:1167:"+billPercentage);
var amountpercent=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_sxrd_amt_percentage',line: j});
//alert("amountpercent"+amountpercent);
var amt=recObject.getCurrentSublistValue
({
sublistId: 'item',
fieldId: 'amount'
});
/////////if((fromAmount<=grossValue)&&(toAmount>=grossValue)){
if(toAmount){
	if((fromAmount<=grossValue)&&(toAmount>=grossValue)){	
if(billPercentage != ''){
	 if(checkingIsClosed == false){
var billPercentage=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_fee_schedule_parent',fieldId: 'custrecord_bill_flat_percentage',line: j});
//alert("billPercentage"+billPercentage);
adjusterAmountToSet= (billPercentage/100)*amt;
              	 alert("adjusterAmountToSet"+adjusterAmountToSet);
var adjusterAmount=recObject.setCurrentSublistValue
({
sublistId: 'item',
fieldId: 'custcol_sxrd_adjustor_amount',
value : adjusterAmountToSet
}); 
break;
	 }
}else{
//	alert("entered second else for line 1196");
	 if(checkingIsClosed == false){
adjusterAmountToSet= (billPercentage/100)*amt;
       //       	 alert("adjusterAmountToSet"+adjusterAmountToSet);
var adjusterAmount=recObject.setCurrentSublistValue
({
sublistId: 'item',
fieldId: 'custcol_sxrd_adjustor_amount',
value : adjusterAmountToSet
}); 
}
}
                             }
}
else{
	//adjusterAmountToSet= (billPercentage/100)*amt;
	              //	 alert("adjusterAmountToSet.else"+adjusterAmountToSet);
	              	if(overrideAdjusterCommission==''){
                      //  alert("entered second second else");//If there is no override commission in SO,get the value from vendor record
                        var vendorId=recObject.getValue({
                          fieldId: 'custbody_sxrd_adjuster'
                        });
                       // alert("vendorId:"+vendorId);
                        var vendorRecord= search.lookupFields({
                          type: search.Type.VENDOR,
                          id: vendorId,
                          columns: ['custentity_sxrd_adjustor_commission']
                        });
                        var commission=vendorRecord.custentity_sxrd_adjustor_commission;
                                    //alert(commission);
                        if(commission){
                          if(checkingIsClosed == false){
                            var lineNo=recObject.selectLine({sublistId:'item',line:i});
                            var fullCommission=recObject.getCurrentSublistValue
                            ({
                              sublistId: 'item',
                              fieldId: 'custcol_sxrd_100_commision'
                            });
                            var amt=recObject.getCurrentSublistValue
                          ({
                            sublistId: 'item',
                            fieldId: 'amount'
                          });
                   //         alert("amt:1237:"+amt);
                            if(fullCommission == false){		//If full commission box is not checked,then set adjuster amount field by multiplying commission percent and amount,otherwise set amount
                               if(fullCommissionValue == true){
                                                 // alert("true");
                               var adjusterAmount=recObject.setCurrentSublistValue
                                ({
                                  sublistId: 'item',
                                  fieldId: 'custcol_sxrd_adjustor_amount',
                                  value : amt
                                });
                             }else if(noCommissionValue == true){
                                  //if(checkingIsClosed == false){
                                    var lineNo=recObject.selectLine({sublistId:'item',line:i});
                                    var adjusterAmount=recObject.setCurrentSublistValue
                                  ({
                                    sublistId: 'item',
                                    fieldId: 'custcol_sxrd_adjustor_amount',
                                    value : 0
                                  });
                                  //}
                                }else{
                                               // alert("false");
                                                // alert((parseFloat(commission)/100)*amt);
                               var adjusterAmount=recObject.setCurrentSublistValue
                                ({
                                  sublistId: 'item',
                                  fieldId: 'custcol_sxrd_adjustor_amount',
                                  value : (parseFloat(commission)/100)*amt
                                });
                             }
                            }
                            else{
                              var adjusterAmount=recObject.setCurrentSublistValue
                              ({
                                sublistId: 'item',
                                fieldId: 'custcol_sxrd_adjustor_amount',
                                value : amt
                              });
                            }
                          }

                        }
                      }
	
	}
//}
//}
}                        
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
                             else  if(overrideAdjusterCommission==''){
                        //       alert("entered second second else");//If there is no override commission in SO,get the value from vendor record
                               var vendorId=recObject.getValue({
                                 fieldId: 'custbody_sxrd_adjuster'
                               });
                              // alert("vendorId:"+vendorId);
                               var vendorRecord= search.lookupFields({
                                 type: search.Type.VENDOR,
                                 id: vendorId,
                                 columns: ['custentity_sxrd_adjustor_commission']
                               });
                               var commission=vendorRecord.custentity_sxrd_adjustor_commission;
                                           //alert(commission);
                               if(commission){
                                 if(checkingIsClosed == false){
                                   var lineNo=recObject.selectLine({sublistId:'item',line:i});
                                   var fullCommission=recObject.getCurrentSublistValue
                                   ({
                                     sublistId: 'item',
                                     fieldId: 'custcol_sxrd_100_commision'
                                   });
                                   var amt=recObject.getCurrentSublistValue
                                 ({
                                   sublistId: 'item',
                                   fieldId: 'amount'
                                 });
                                   //alert("amt:"+amt);
                                   if(fullCommission == false){		//If full commission box is not checked,then set adjuster amount field by multiplying commission percent and amount,otherwise set amount
                                      if(fullCommissionValue == true){
                                                        // alert("true");
                                      var adjusterAmount=recObject.setCurrentSublistValue
                                       ({
                                         sublistId: 'item',
                                         fieldId: 'custcol_sxrd_adjustor_amount',
                                         value : amt
                                       });
                                    }else if(noCommissionValue == true){
                                         //if(checkingIsClosed == false){
                                           var lineNo=recObject.selectLine({sublistId:'item',line:i});
                                           var adjusterAmount=recObject.setCurrentSublistValue
                                         ({
                                           sublistId: 'item',
                                           fieldId: 'custcol_sxrd_adjustor_amount',
                                           value : 0
                                         });
                                         //}
                                       }else{
                                                      // alert("false");
                                                       // alert((parseFloat(commission)/100)*amt);
                                      var adjusterAmount=recObject.setCurrentSublistValue
                                       ({
                                         sublistId: 'item',
                                         fieldId: 'custcol_sxrd_adjustor_amount',
                                         value : (parseFloat(commission)/100)*amt
                                       });
                                    }
                                   }
                                   else{
                                     var adjusterAmount=recObject.setCurrentSublistValue
                                     ({
                                       sublistId: 'item',
                                       fieldId: 'custcol_sxrd_adjustor_amount',
                                       value : amt
                                     });
                                   }
                                 }

                               }
                             }
                           }
                    	 }
                    }
                      // }
                  }
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                           
        }
        }
    //alert("overrideAdjusterCommission:"+overrideAdjusterCommission);
        return true;
    }else{
      alert("Please choose atleast one item");
    }

  }catch(error){
    log.debug("error",error);
  }
  }
   /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
      var lineNo=recObject.getLineCount({sublistId: 'item'});
      if(lineNo ==0){
        recObject.selectNewLine({
          sublistId: 'item'
        });
        recObject.setCurrentSublistValue
        ({
          sublistId: 'item',
          fieldId: 'item',
          value :138,
          ignoreFieldChange: true
        });
        recObject.setCurrentSublistValue
        ({
          sublistId: 'item',
          fieldId: 'quantity',
          value :1,
          ignoreFieldChange: true
        });
        recObject.setCurrentSublistValue
        ({
          sublistId: 'item',
          fieldId: 'amount',
          value :0,
          ignoreFieldChange: true
        });
          recObject.commitLine({sublistId: 'item'});
      }

    }
  /*function validateLine(scriptContext) {		//checks whether the entered item is in schedule,if so set the amount corresponding to the schedule record,or else set the amount of item record value
    try{
    var currentRecordObj = scriptContext.currentRecord;
    var sublistName = scriptContext.sublistId;
    if (sublistName === 'item'){
      var feeScheduleId =  currentRecordObj.getValue({
        fieldId: 'custbody_sxrd_fee_schedule'
      });
      var itemGiven =  currentRecordObj.getCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'item'
      });
      //alert("itemGiven"+itemGiven);
      if(feeScheduleId){
        var customrecord=record.load({
          type: 'customrecord_sxrd_fee_schedule',
          id: feeScheduleId
        });

        var itemLineCount=customrecord.getLineCount({
          sublistId: 'recmachcustrecord_sxrd_line_item_parent'
        });
        //alert("itemLineCount"+itemLineCount);
        for(var j=0;j<itemLineCount;j++){
          var itemId=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_line_item_parent',fieldId: 'custrecord_sxrd_item_name',line: j});
          //alert("itemId"+itemId);
          var itemRate=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_line_item_parent',fieldId: 'custrecord_sxrd_line_rate',line: j});
          if(itemGiven == itemId){
            currentRecordObj.setCurrentSublistValue({
              sublistId: 'item',
              fieldId: 'rate',
              value :itemRate,
              ignoreFieldChange: true
            });
            var quant=currentRecordObj.getCurrentSublistValue({
              sublistId: 'item',
              fieldId: 'quantity',
            });
            currentRecordObj.setCurrentSublistValue({
              sublistId: 'item',
              fieldId: 'amount',
              value :quant*itemRate,
              ignoreFieldChange: true
            });
            break;
          }
        }

      }
      //}
    }
    return true;
  }catch(error){
    log.debug("error",error);
  }
  }*/
   /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
  try{
    var currentRecordObj = scriptContext.currentRecord;
      //if (sublistName === 'item' && subListField != 'item'){
    if(scriptContext.fieldId ==='item'){
          //alert("trigger");
      var feeScheduleId =  currentRecordObj.getValue({
        fieldId: 'custbody_sxrd_fee_schedule'
      });
      var itemGiven =  currentRecordObj.getCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'item'
      });
      //alert("itemGiven"+itemGiven);
      if(feeScheduleId){
        var customrecord=record.load({
          type: 'customrecord_sxrd_fee_schedule',
          id: feeScheduleId
        });

        var itemLineCount=customrecord.getLineCount({
          sublistId: 'recmachcustrecord_sxrd_line_item_parent'
        });
        //alert("itemLineCount"+itemLineCount);
        for(var j=0;j<=itemLineCount;j++){
          var itemId=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_line_item_parent',fieldId: 'custrecord_sxrd_item_name',line: j});
          //alert("itemId"+itemId);
          var itemRate=customrecord.getSublistValue({sublistId: 'recmachcustrecord_sxrd_line_item_parent',fieldId: 'custrecord_sxrd_line_rate',line: j});
                   // alert(itemRate);
          if(itemGiven == itemId){
                       alert("itemGiven"+itemGiven);
                         alert("itemId"+itemId);
                        alert("itemRate"+itemRate);
                      setTimeout(function(){
              currentRecordObj.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate',
                  value :itemRate
                });
              var givenRate=currentRecordObj.getCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'rate'
                });
                            alert("givenRate"+givenRate);
              currentRecordObj.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'quantity',
                  value :1,
                  ignoreFieldChange: true
                });
              var quant=currentRecordObj.getCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'quantity'
                });
                            alert(quant);
              currentRecordObj.setCurrentSublistValue
                ({
                  sublistId: 'item',
                  fieldId: 'amount',
                  value : quant*givenRate
                });}, 2000);
          }
        }

      }
      //}
    }

  }catch(error){
    log.debug("error",error);
  }
}

  return {
    feeScheduleAmount:feeScheduleAmount,
    adjusterCommission:adjusterCommission,
    pageInit: pageInit,
    //validateLine:validateLine,
    //fieldChanged:fieldChanged


  };

});
