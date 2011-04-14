var PricingLadderRenderer = function(){
	this.timerId = -1;
	this.currentBestBidData = new PriceData();
	this.currentBestAskData = new PriceData();
};

PricingLadderRenderer.prototype.render = function(pricingModel){
	var askSteps = $(pricingModel.askData);
	var bidSteps = $(pricingModel.bidData);
	this._getPricingLadder().show();
	this._updatePricingLadderTitle(pricingModel.title);
	this._updatePricingLadder(askSteps, bidSteps);
};

PricingLadderRenderer.prototype._updatePricingLadder = function(askSteps, bidSteps){
	clearTimeout(this.timerId);
	var pricingLadder = this._getPricingLadder()[0];
	var resetFragment = this._createTableFragement(askSteps, bidSteps);	

	var bestBidStep = bidSteps[0];
	var bestAskStep = askSteps[askSteps.length -1];
	
	bestBidStep.determinePriceChange(this.currentBestBidData);
	bestAskStep.determinePriceChange(this.currentBestAskData);
	
	this.currentBestBidData = bestBidStep;
	this.currentBestAskData = bestAskStep;
	
	var flashFragment = this._createTableFragement(askSteps, bidSteps);	
	pricingLadder.replaceChild(flashFragment, pricingLadder.firstChild);
	
	this.timerId = setTimeout(function(){
		pricingLadder.replaceChild(resetFragment, pricingLadder.firstChild);
	},300);	
};

PricingLadderRenderer.prototype._updatePricingLadderTitle = function(title){
	var ladderTitle = this._getPricingLadderTitle();
	ladderTitle.text(title);
	ladderTitle.show();	
};


PricingLadderRenderer.prototype._getPricingLadderTitle = function(){
	return $('#pricingLadderTitle');
};

PricingLadderRenderer.prototype._createTableFragement = function(askSteps, bidSteps){
	var bestBidPrice = bidSteps[0].price;
	var bestAskPrice = askSteps[askSteps.length -1].price;
	var fragment = document.createDocumentFragment();
	var pricingLadderTable = $(fragment.appendChild($("<table>")[0]));
	pricingLadderTable.append(this._createHeader());
	var tableBody = $('<tbody>'); 
	pricingLadderTable.append(tableBody);
	
	var tableBodyInnerHtml = new StringBuilder();
	this._createAskStepsFrom(askSteps, tableBodyInnerHtml, bestBidPrice);
	this._createBidStepsFrom(bidSteps, tableBodyInnerHtml, bestAskPrice);
	tableBody.html(tableBodyInnerHtml.toString());
	
	this._markBestPriceRowAsYellow(tableBody[0].rows[4]);
	this._markBestPriceRowAsYellow(tableBody[0].rows[5]);
	this._decorateLadderSteps($(tableBody.children()))
	return fragment;
};

PricingLadderRenderer.prototype._createAskStepsFrom = function(steps, tableBodyInnerHtml, bestBidPrice){
	if(steps.length < 5) {
		this._addEmptyStepRows(5 - steps.length, tableBodyInnerHtml);
	}
	this._createStepsFrom(steps, true, tableBodyInnerHtml, bestBidPrice);
};

PricingLadderRenderer.prototype._markBestPriceRowAsYellow = function(bestPriceRow){
	$(bestPriceRow).addClass("best_price_row");
}
PricingLadderRenderer.prototype._createBidStepsFrom = function(steps, tableBodyInnerHtml, bestAskPrice){
	this._createStepsFrom(steps, false, tableBodyInnerHtml, bestAskPrice);
	if(steps.length < 5) {
		this._addEmptyStepRows(5 - steps.length, tableBodyInnerHtml);
	}
};

PricingLadderRenderer.prototype._decorateLadderSteps = function(pricingLadderRows){
	for(var i = 0; i < pricingLadderRows.length; i++) {
		var eachRow = pricingLadderRows[i];
		$(eachRow).addClass(i%2 == 0 ? 'even_row' : 'odd_row');
	}
};

PricingLadderRenderer.prototype._createHeader = function(step){
	var headerRow = $('<tr>');
	var header =  $('<thead>').append(headerRow);
	headerRow.append(this._createHeaderCell('Bid Qty'))
			 .append(this._createHeaderCell('Price'))
			 .append(this._createHeaderCell('Ask Qty'));
	return header;
};

PricingLadderRenderer.prototype._createHeaderCell = function(value){
	var headerCell = $('<td>');
	headerCell.addClass("table_header")
			  .append(document.createTextNode(value))
	return headerCell;
};

PricingLadderRenderer.prototype._createStepsFrom = function(steps, isAskSteps, tableBodyInnerHtml, bestPrice){
	var that = this;
	for(var i = 0; i < steps.length; i++) {
		var step = steps[i];
		var stepRow = that._createStepRowFrom(step, isAskSteps, bestPrice);
		tableBodyInnerHtml.append(stepRow);
	}
};

PricingLadderRenderer.prototype._addEmptyStepRows = function(noOfRows, tableBodyInnerHtml){
	for(var i = 0; i < noOfRows; i++) {
		tableBodyInnerHtml.append(this._createEmptyStepRow());
	}
};

PricingLadderRenderer.prototype._createEmptyStepRow = function(){
	var emptyRow = new StringBuilder();
	emptyRow.append("<tr>");
	emptyRow.append(this._createStepCellFrom('','buy_column'));
	emptyRow.append(this._createStepCellFrom(''));
	emptyRow.append(this._createStepCellFrom('', 'sell_column'));
	return emptyRow.toString();
};

PricingLadderRenderer.prototype._createStepRowFrom = function(step, isAskStep, bestPrice){
	var stepRow = new StringBuilder();
	stepRow.append('<tr>');
	if(isAskStep){
		stepRow.append(this._createStepCellFrom('','buy_column'));

		var priceCell = this._createStepCellFrom(step.price, 'price_column');
		stepRow.append(priceCell);
		
		var quantityCellClass = "sell_column"; 
		step.price <= bestPrice ? quantityCellClass+=" greenColor" : "";
		step.priceChanged ? quantityCellClass+=' sell_move' : "";
		var quantityCell = this._createStepCellFrom(step.quantity, quantityCellClass);
		stepRow.append(quantityCell);
	}
	else {
		var quantityCellClass = "buy_column"; 
		step.price >= bestPrice ? quantityCellClass+=" greenColor" : "";
		step.priceChanged ? quantityCellClass+=' buy_move' : "";
		var quantityCell = this._createStepCellFrom(step.quantity, quantityCellClass);
		stepRow.append(quantityCell);
		
		
		var priceCell = this._createStepCellFrom(step.price, 'price_column');
		stepRow.append(priceCell);
		
		stepRow.append(this._createStepCellFrom('', 'sell_column'));
	}
	stepRow.append('</tr>')
	return stepRow.toString();
};

PricingLadderRenderer.prototype._createStepCellFrom = function(value, className){
	var stepCell = "<td class='"+ className +"'>" + value + "</td>" 
	return stepCell;
};

PricingLadderRenderer.prototype.reset = function(){
	this._getPricingLadder().hide();
	this._getPricingLadderTitle().hide();
	this.timerId = -1;
};

PricingLadderRenderer.prototype._getPricingLadder = function(){
	return $('#pricingLadder');
};