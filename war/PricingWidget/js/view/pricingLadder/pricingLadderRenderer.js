var PricingLadderRenderer = function(){
	this.timerId = -1;
	this.currentBidData = new BidData();
	this.currentAskData = new AskData();
};

PricingLadderRenderer.prototype.render = function(pricingModel){
	var askSteps = pricingModel.askData;
	var bidSteps = pricingModel.bidData;
	this._getPricingLadder().show();
	this._updatePricingLadderTitle(pricingModel.title);
	this._updatePricingLadder(askSteps, bidSteps);
};

PricingLadderRenderer.prototype._updatePricingLadder = function(askSteps, bidSteps){
	this._clearTimeIfRunning();	
		
	var pricingLadder = this._getPricingLadder()[0];
//	var resetFragment = this._createTableFragement(askSteps, bidSteps);
//	
//	askSteps.determinePriceChange(this.currentAskData);
//	bidSteps.determinePriceChange(this.currentBidData);
//	
//	this.currentBidData = bidSteps;
//	this.currentAskData = askSteps;
	
	var flashFragment = this._createTableFragement(askSteps, bidSteps);
	pricingLadder.replaceChild(flashFragment, pricingLadder.firstChild);
//	this.timerId = setTimeout(function(){
//		pricingLadder.replaceChild(resetFragment, pricingLadder.firstChild);
//	},100);	
};

PricingLadderRenderer.prototype._clearTimeIfRunning = function(){
	if (-1 != this.timerId)
	{
		clearTimeout(this.timerId);
	}
};

PricingLadderRenderer.prototype._updatePricingLadderTitle = function(title){
	var ladderTitle = this._getPricingLadderTitle();
	ladderTitle.text(title);
	ladderTitle.show();	
};

PricingLadderRenderer.prototype._getPricingLadderTitle = function(){
	return $('.pricingLadderTitle');
};

PricingLadderRenderer.prototype._createTableFragement = function(askSteps, bidSteps){
	var fragment = document.createDocumentFragment();
	var pricingLadderTable = fragment.appendChild(document.createElement("table"));
	pricingLadderTable.appendChild(this._createHeader());
	this._createStepsFrom(askSteps, true, pricingLadderTable);
	this._createStepsFrom(bidSteps, false, pricingLadderTable);	
	this._decorateLadderSteps(pricingLadderTable.children)
	return fragment;
};

PricingLadderRenderer.prototype._decorateLadderSteps = function(pricingLadderRows){
	for(var i =0; i < pricingLadderRows.length; i++){
		pricingLadderRows[i].className = (i%2 == 0 ? 'even_row' : 'odd_row');
	}
};

PricingLadderRenderer.prototype._createHeader = function(step){
	var header = document.createElement('tr');
	header.appendChild(this._createHeaderCell('Bid Qty'));
	header.appendChild(this._createHeaderCell('Price'));
	header.appendChild(this._createHeaderCell('Ask Qty'));
	return header;
};

PricingLadderRenderer.prototype._createHeaderCell = function(value){
	var headerCell = document.createElement('td');
	headerCell.className = "table_header";
	headerCell.appendChild(document.createTextNode(value))
	return headerCell;
};

PricingLadderRenderer.prototype._createStepsFrom = function(steps, isAskSteps, pricingLadderTable){
	for(var i = 0; i < steps.length; i++){
		var stepRow = this._createStepRowFrom(steps[i], isAskSteps);
		pricingLadderTable.appendChild(stepRow);
	}
};

PricingLadderRenderer.prototype._createStepRowFrom = function(step, isAskStep){
	var stepRow = document.createElement('tr');
	if(isAskStep){
		stepRow.appendChild(this._createStepCellFrom('','buy_column'));
		stepRow.appendChild(this._createStepCellFrom(step.price));
		stepRow.appendChild(this._createStepCellFrom(step.quantity, 'sell_column'));
	}
	else{
		stepRow.appendChild(this._createStepCellFrom(step.quantity, 'buy_column'));
		stepRow.appendChild(this._createStepCellFrom(step.price));
		stepRow.appendChild(this._createStepCellFrom('', 'sell_column'));
	}
	return stepRow;
};

PricingLadderRenderer.prototype._createStepCellFrom = function(value, className){
	var stepCell = document.createElement('td');
	stepCell.className = className;
	stepCell.appendChild(document.createTextNode(value));
	return stepCell;
};

PricingLadderRenderer.prototype.reset = function(){
	this._getPricingLadder().hide();
	this._getPricingLadderTitle().hide();
	this.timerId = -1;
};

PricingLadderRenderer.prototype._getPricingLadder = function(){
	return $('.pricingLadder');
};