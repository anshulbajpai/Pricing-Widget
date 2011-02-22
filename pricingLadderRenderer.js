var PricingLadderRenderer = function(){
	this.currentSteps = null;
};

PricingLadderRenderer.prototype.render = function(steps){
	if(!this.currentSteps)
		this.currentSteps = steps;
	var pricingLadder = this._getPricingLadder();
	var resetFragment = this._createTableFragement(steps);
	pricingLadder.replaceChild(resetFragment, pricingLadder.firstChild);
};

PricingLadderRenderer.prototype._createTableFragement = function(steps){
	var fragment = document.createDocumentFragment();
	var pricingLadderTable = fragment.appendChild(document.createElement("table"));
	pricingLadderTable.appendChild(this._createHeader());
	for(var i = 0; i < steps.length; i++){
		pricingLadderTable.appendChild(this._createStepRowFrom(steps[i]));
	}
	return fragment;
};

PricingLadderRenderer.prototype._createHeader = function(step){
	var header = document.createElement('tr');
	header.appendChild(this._createHeaderCell('Buy'));
	header.appendChild(this._createHeaderCell('Price'));
	header.appendChild(this._createHeaderCell('Sell'));
	return header;
};

PricingLadderRenderer.prototype._createHeaderCell = function(value){
	var headerCell = document.createElement('td');
	headerCell.className = "table_header";
	headerCell.appendChild(document.createTextNode(value))
	return headerCell;
};

PricingLadderRenderer.prototype._createStepRowFrom = function(step){
	var stepRow = document.createElement('tr');
	stepRow.appendChild(this._createStepCellFrom(step.buyDepth, 'buy_column'));
	stepRow.appendChild(this._createStepCellFrom(step.price));
	stepRow.appendChild(this._createStepCellFrom(step.sellDepth, 'sell_column'));
	return stepRow;
};

PricingLadderRenderer.prototype._createStepCellFrom = function(value, className){
	var stepCell = document.createElement('td');
	stepCell.className = className;
	stepCell.appendChild(document.createTextNode(value));
	return stepCell;
};

PricingLadderRenderer.prototype._getPricingLadder = function(){
	return document.getElementById('pricingLadder');
};