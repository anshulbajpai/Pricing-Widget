var PricingLadderRenderer = function(){};

PricingLadderRenderer.prototype.render = function(parsedResponse){
	this._updatePricingLadderTitle(parsedResponse.title);
	this._updatePricingLadder(parsedResponse.steps);
};

PricingLadderRenderer.prototype._updatePricingLadder = function(steps){
	var pricingLadder = this._getPricingLadder();
	pricingLadder.replaceChild(this._createTableFragement(steps), pricingLadder.firstChild);
};

PricingLadderRenderer.prototype._updatePricingLadderTitle = function(title){
	this._getPricingLadderTitle().innerHTML = title;
};

PricingLadderRenderer.prototype._getPricingLadderTitle = function(){
	return document.getElementById('pricingLadderTitle');
};

PricingLadderRenderer.prototype._createTableFragement = function(steps){
	var fragment = document.createDocumentFragment();
	var pricingLadderTable = fragment.appendChild(document.createElement("table"));
	pricingLadderTable.appendChild(this._createHeader());
	for(var i = 0; i < steps.length; i++){
		var stepRow = this._createStepRowFrom(steps[i]);
		stepRow.className = (i%2 == 0 ? 'even_row' : 'odd_row');
		pricingLadderTable.appendChild(stepRow);
	}
	return fragment;
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

PricingLadderRenderer.prototype._createStepRowFrom = function(step){
	var stepRow = document.createElement('tr');
	stepRow.appendChild(this._createStepCellFrom(step.bidQty, 'buy_column'));
	stepRow.appendChild(this._createStepCellFrom(step.price));
	stepRow.appendChild(this._createStepCellFrom(step.askQty, 'sell_column'));
	return stepRow;
};

PricingLadderRenderer.prototype._createStepCellFrom = function(value, className){
	var stepCell = document.createElement('td');
	stepCell.className = className;
	stepCell.appendChild(document.createTextNode(value));
	return stepCell;
};

PricingLadderRenderer.prototype.reset = function(){

};

PricingLadderRenderer.prototype._getPricingLadder = function(){
	return document.getElementById('pricingLadder');
};