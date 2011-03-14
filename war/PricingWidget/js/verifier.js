var Verifier = function(){
	this.tableBody = $("#verifier")[0].tBodies[0];
	this.enabled = false;
};

Verifier.prototype.toggleLogging = function(){
	this.enabled  = !this.enabled;
};

Verifier.prototype.clearLog = function(){	
	this.tableBody.innerHTML = '';		
};

Verifier.prototype.addInterimUpdate = function(lowestBidData, highestAskData, lastReceivedBidData, lastReceivedAskData){
	this.enabled && this._createInterimRow(lowestBidData, highestAskData, lastReceivedBidData, lastReceivedAskData);	
};

Verifier.prototype.addFinalUpdate = function(bidData, askData){
	this.enabled && this._createFinalRow(bidData, askData);	
};

Verifier.prototype._createInterimRow = function(lowestBidData, highestAskData, lastReceivedBidData, lastReceivedAskData){	
	var row = this.tableBody.appendChild(document.createElement('tr'));
	row.height = '10px';
	row.appendChild(this._createCellWith(lowestBidData._getBestPrice()));
	row.appendChild(this._createCellWith(highestAskData._getBestPrice()));
	row.appendChild(this._createCellWith(lastReceivedBidData._getBestPrice()));
	row.appendChild(this._createCellWith(lastReceivedAskData._getBestPrice()));
	row.appendChild(this._createCellWith(''));
	row.appendChild(this._createCellWith(''));
};

Verifier.prototype._createFinalRow = function(bidData, askData){	
	var row = this.tableBody.appendChild(document.createElement('tr'));
	row.height = '10px';
	row.appendChild(this._createCellWith(''));
	row.appendChild(this._createCellWith(''));
	row.appendChild(this._createCellWith(''));
	row.appendChild(this._createCellWith(''));
	row.appendChild(this._createCellWith(bidData._getBestPrice()));
	row.appendChild(this._createCellWith(askData._getBestPrice()));	
};

Verifier.prototype._createCellWith = function(data){
	var cell = document.createElement('td');
	cell.innerHTML = data;
	return cell;
};

