var PricingLadderRenderer = function(){};

PricingLadderRenderer.prototype.render = function(steps){
	this._getPricingLadder().replaceChild(this._createTableFragement(steps), pricingLadder.firstChild);
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
	var headerCell = document.createElement('th');
	headerCell.innerHTML = value;
	return headerCell;
};

PricingLadderRenderer.prototype._createStepRowFrom = function(step){
	var stepRow = document.createElement('tr');
	stepRow.appendChild(this._createStepCellFrom(step.buyDepth));
	stepRow.appendChild(this._createStepCellFrom(step.price));
	stepRow.appendChild(this._createStepCellFrom(step.sellDepth));
	return stepRow;
};

PricingLadderRenderer.prototype._createStepCellFrom = function(value){
	var stepCell = document.createElement('td');
	stepCell.appendChild(document.createTextNode(value));
	return stepCell;
};

PricingLadderRenderer.prototype._getPricingLadder = function(){
	return document.getElementById('pricingLadder');
};