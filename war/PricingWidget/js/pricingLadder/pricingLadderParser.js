var PricingLadderParser = function(){};

PricingLadderParser.prototype.createLadderStepsFrom = function(response){
	var parsedResponse = this._getParsedResponseFrom(response);
	var bidSteps =  this._createLadderStepsFrom(parsedResponse[1], true);
	var askSteps = this._createLadderStepsFrom(parsedResponse[2], false);
	return {title : parsedResponse[0], steps : askSteps.reverse().concat(bidSteps)};
};

PricingLadderParser.prototype._getParsedResponseFrom = function(response){
	return response.split('|').slice(2);
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