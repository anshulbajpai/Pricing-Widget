var PriceWidgetController = function(urlTemplate, ajaxWrapper, pricingDataParser, instrumentParser, priceWidgets){
	var that = this;
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.pricingDataParser = pricingDataParser;
	this.instrumentParser = instrumentParser;
	this.priceWidgets = priceWidgets;
	this.priceDataContainer = new PriceDataContainer(this._updateWidgets, this);
	this.displayDiv = null;
	this.selectedInstrument = null
	this.cnt = 0;
};

PriceWidgetController.prototype._updateWidgets = function(pricingModel){
	this.priceWidgets.update(pricingModel);
};

PriceWidgetController.prototype.show = function(instrumentId){
	this.instrumentId = instrumentId;
	this.priceDataContainer.reset();	
	this.priceWidgets.reset();
	this._getResponse();
	this.priceDataContainer.init();
};

PriceWidgetController.prototype.reset = function() {
	this.ajaxWrapper.stopContinousRequest();
	this.priceDataContainer.reset();
	this.priceWidgets.reset();
};

PriceWidgetController.prototype._getResponse = function(){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate, function(response){this._successCallback(response, this.cnt++)}, this);
};

PriceWidgetController.prototype._successCallback = function(response, counter){
	console.time('successCallback' + counter);
	var trimmedText = response.trim();
	if (trimmedText.length > 0)
	{
		var instrumentResponse =  this._getInstrumentResponse(trimmedText);
		var currentPricingModel = this.pricingDataParser.createPricingModelFrom(instrumentResponse);
		this.priceDataContainer.add(currentPricingModel);
		this.updateInstrumentTable(trimmedText);
	}
	console.timeEnd('successCallback'+counter);	
};

PriceWidgetController.prototype._getInstrumentResponse = function(response){	
	var allInstruments = response.split('\n');
	for(var i=0; i < allInstruments.length; i++){
		if(allInstruments[i].split('|')[0] == this.instrumentId){
			return allInstruments[i];			
		}
	}
};

PriceWidgetController.prototype.updateInstrumentTable = function(response){	
	var instruments = this.instrumentParser.parseInstruments(response);
	var fragment = this.createTableFragment(instruments);
	this._getDisplayDiv().replaceChild(fragment, this._getDisplayDiv().firstChild);
	if(!this.selectedInstrument)
		$('tr[instrumentId=4001]').trigger('click');
};

PriceWidgetController.prototype.createTableFragment = function(instruments) {
	var fragment = document.createDocumentFragment();
	var tableTag = document.createElement("table");
	fragment.appendChild(tableTag);
	this._addHeadersToTable(tableTag, tableHeaderTitles);
	for (var i = 0, size = instruments.length; i < size; i++)
	{
		this._addInstrumentToTable(tableTag, instruments[i], i);
	}
	if(instruments.length < 10) {
		for(var i = instruments.length; i < 10; i++){
			this._addEmptyRowToInstrumentTable(tableTag, i);
		}
	}
	return fragment;
};

PriceWidgetController.prototype._addHeadersToTable = function(tableTag, headers)
{
	var tableHeaderTag = document.createElement("tr");
	tableTag.appendChild(tableHeaderTag);

	for (var i = 0, size = headers.length; i < size; i++)
	{
		var tableHeaderDataTag = document.createElement("td");
		tableHeaderDataTag.setAttribute("class", "table_header");
		tableHeaderTag.appendChild(tableHeaderDataTag);
		tableHeaderDataTag.appendChild(document.createTextNode(headers[i]));
	}
};

PriceWidgetController.prototype._addInstrumentToTable = function(tableTag, instrument, rowIndex) {
	var rowTag = document.createElement("tr");
	rowTag.setAttribute("class", (0 == rowIndex % 2) ? "even_row" : "odd_row");
	tableTag.appendChild(rowTag);

	rowTag.instrumentId = instrument.orderBookId;
	rowTag.status = instrument.status;

	$(rowTag).hover(mouseEnterOnInstrument, mouseLeaveOnInstrument);
	var that = this;
	$(rowTag).click(function(){that.handleClickForInstrument(this);});	
	
	if(this.selectedInstrument && instrument.orderBookId == this.selectedInstrument.instrumentId){
		$(rowTag).addClass(getInstrumentClickClass());		
	}
	
	var instrumentNameCell = document.createElement("td");
	instrumentNameCell.setAttribute("class", "instrument_column");

	rowTag.appendChild(instrumentNameCell);
	var rowImg = document.createElement("img");
	rowImg.setAttribute("class", "status_img");
	rowImg.src = baseUrl + instrument.status + ".png";
	instrumentNameCell.appendChild(rowImg);
	
	var instrumentName = instrumentNameCell.appendChild(document.createElement('span'));
	instrumentName.id = instrument.commonName;
	instrumentName.innerHTML = instrument.commonName;;
	
	var spreadCell = document.createElement("td");
	rowTag.appendChild(spreadCell);
	spreadCell.appendChild(document.createTextNode(instrument.spread));
	var spreadClasses = "spread_column";	
	if (instrument.spread <= 0.0)
	{
		spreadClasses += " choice_market";
	}
	spreadCell.setAttribute("class", spreadClasses);
};

PriceWidgetController.prototype._addEmptyRowToInstrumentTable = function(tableTag, rowIndex) {
	var rowTag = document.createElement("tr");
	rowTag.setAttribute("class", (0 == rowIndex % 2) ? "even_row" : "odd_row");
	tableTag.appendChild(rowTag);

	var instrumentNameCell = document.createElement("td");
	instrumentNameCell.setAttribute("class", "instrument_column");
	rowTag.appendChild(instrumentNameCell);
	
	var spreadCell = document.createElement("td");
	spreadCell.setAttribute("class", "spread_column");
	rowTag.appendChild(spreadCell);
};

PriceWidgetController.prototype._getDisplayDiv = function() {
	if(!this.displayDiv) {
		this.displayDiv = document.getElementById("data");
	}
	return this.displayDiv;
};

PriceWidgetController.prototype.handleClickForInstrument = function(instrumentRow){
	if(this.selectedInstrument){
		$(this.selectedInstrument).removeClass(getInstrumentClickClass());		
	}
	this.selectedInstrument = instrumentRow;
	$(this.selectedInstrument).removeClass(getInstrumentHoverClass());	
	$(this.selectedInstrument).addClass(getInstrumentClickClass());	
	if(this.status == "Closed"){
		priceWidgetController.reset();
	}
	else{
		priceWidgetController.show(this.selectedInstrument.instrumentId);
	}
};