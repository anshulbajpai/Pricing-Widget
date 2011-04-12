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
	this._createAskStepsFrom(askSteps, tableBody, bestBidPrice);
	this._createBidStepsFrom(bidSteps, tableBody, bestAskPrice);	
	this._decorateLadderSteps($(tableBody.children()))
	return fragment;
};

PricingLadderRenderer.prototype._createAskStepsFrom = function(steps, tableBody, bestBidPrice){
	if(steps.length < 5) {
		this._addEmptyStepRows(5 - steps.length, tableBody);
	}
	this._createStepsFrom(steps, true, tableBody, bestBidPrice);
	this._markBestPriceRowAsYellow(tableBody[0].rows[4]);
};

PricingLadderRenderer.prototype._markBestPriceRowAsYellow = function(bestPriceRow){
	$(bestPriceRow).addClass("best_price_row");
}
PricingLadderRenderer.prototype._createBidStepsFrom = function(steps, tableBody, bestAskPrice){
	this._createStepsFrom(steps, false, tableBody, bestAskPrice);
	if(steps.length < 5) {
		this._addEmptyStepRows(5 - steps.length, tableBody);
	}
	this._markBestPriceRowAsYellow(tableBody[0].rows[5]);
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

PricingLadderRenderer.prototype._createStepsFrom = function(steps, isAskSteps, tableBody, bestPrice){
	var that = this;
	for(var i = 0; i < steps.length; i++) {
		var step = steps[i];
		var stepRow = that._createStepRowFrom(step, isAskSteps, bestPrice);
		tableBody.append(stepRow);
	}
};

PricingLadderRenderer.prototype._addEmptyStepRows = function(noOfRows, tableBody){
	for(var i = 0; i < noOfRows; i++) {
		tableBody.append(this._createEmptyStepRow());
	}
};

PricingLadderRenderer.prototype._createEmptyStepRow = function(){
	var emptyRow = $('<tr>');
	emptyRow.append(this._createStepCellFrom('','buy_column'));
	emptyRow.append(this._createStepCellFrom(''));
	emptyRow.append(this._createStepCellFrom('', 'sell_column'));
	return emptyRow;
};

PricingLadderRenderer.prototype._createStepRowFrom = function(step, isAskStep, bestPrice){
	var stepRow = $('<tr>');
	if(isAskStep){
		stepRow.append(this._createStepCellFrom('','buy_column'));

		var priceCell = this._createStepCellFrom(step.price, 'price_column');
		stepRow.append(priceCell);
		
		var quantityCell = this._createStepCellFrom(step.quantity, 'sell_column');
		stepRow.append(quantityCell);
		(step.price <= bestPrice) && quantityCell.addClass('greenColor');
		step.priceChanged && quantityCell.addClass('sell_move');
	}
	else {
		var quantityCell = this._createStepCellFrom(step.quantity, 'buy_column');
		stepRow.append(quantityCell);
		(step.price >= bestPrice) && quantityCell.addClass('greenColor');
		
		var priceCell = this._createStepCellFrom(step.price, 'price_column');
		stepRow.append(priceCell);
		
		stepRow.append(this._createStepCellFrom('', 'sell_column'));
		step.priceChanged && quantityCell.addClass('buy_move');
	}
	return stepRow;
};

PricingLadderRenderer.prototype._createStepCellFrom = function(value, className){
	var stepCell = $('<td>');
	stepCell.addClass(className).append(document.createTextNode(value));
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