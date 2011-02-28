var PricingLadderParser = function(){};

PricingLadderParser.prototype.createLadderStepsFrom = function(response){
	var ladderStepsResponse = this._getLadderStepsResponseFrom(response);
	var bidSteps =  this._createLadderStepsFrom(ladderStepsResponse[0], true);
	var askSteps = this._createLadderStepsFrom(ladderStepsResponse[1], false);
	return askSteps.reverse().concat(bidSteps);
};

PricingLadderParser.prototype._getLadderStepsResponseFrom = function(response){
	return response.split('|').slice(3);
};

PricingLadderParser.prototype._createLadderStepsFrom = function(ladderResponse, isBidStep){
	var stepsResponse = ladderResponse.split(';');
	var steps = [];
	for(var i = 0; i < stepsResponse.length ; i++){	
		var stepData = stepsResponse[i].split('@');
		steps.push(isBidStep ? new PricingStep(stepData[0], '', stepData[1]) : new PricingStep('', stepData[0], stepData[1]));
	}
	return steps;
};

var PricingStep = function(bidQty, askQty, price){
	this.bidQty = bidQty;
	this.askQty = askQty;
	this.price = price;
};