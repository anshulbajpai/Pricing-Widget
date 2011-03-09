var PricingLadderRenderer = function(){};

PricingLadderRenderer.prototype.render = function(pricingModel){
	var askSteps = pricingModel.askData.reverse();
	var bidSteps = pricingModel.bidData;
	this._updatePricingLadderTitle(pricingModel.title);
	this._updatePricingLadder(askSteps, bidSteps);
};

PricingLadderRenderer.prototype._updatePricingLadder = function(askSteps, bidSteps){
	var pricingLadder = this._getPricingLadder();
	pricingLadder.replaceChild(this._createTableFragement(askSteps, bidSteps), pricingLadder.firstChild);
};

PricingLadderRenderer.prototype._updatePricingLadderTitle = function(title){
	this._getPricingLadderTitle().innerHTML = title;
};

PricingLadderRenderer.prototype._getPricingLadderTitle = function(){
	return document.getElementById('pricingLadderTitle');
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
		stepRow.appendChild(this._createEmptyStepCell());
		stepRow.appendChild(this._createStepCellFrom(step.price));
		stepRow.appendChild(this._createStepCellFrom(step.quantity, 'sell_column'));
	}
	else{
		stepRow.appendChild(this._createStepCellFrom(step.quantity, 'buy_column'));
		stepRow.appendChild(this._createStepCellFrom(step.price));
		stepRow.appendChild(this._createEmptyStepCell());
	}
	return stepRow;
};

PricingLadderRenderer.prototype._createStepCellFrom = function(value, className){
	var stepCell = document.createElement('td');
	stepCell.className = className;
	stepCell.appendChild(document.createTextNode(value));
	return stepCell;
};

PricingLadderRenderer.prototype._createEmptyStepCell = function(){
	return document.createElement('td');
};

PricingLadderRenderer.prototype.reset = function(){

};

PricingLadderRenderer.prototype._getPricingLadder = function(){
	return document.getElementById('pricingLadder');
};