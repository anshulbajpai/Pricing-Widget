var PricingLadderParser = function(){};

PricingLadderParser.prototype.createLadderStepsFrom = function(response){
	var ladderStepsResponse = this._getLadderStepsResponseFrom(response);
	var buySteps =  this._createLadderStepsFrom(ladderStepsResponse[0], true);
	var sellSteps = this._createLadderStepsFrom(ladderStepsResponse[1], false);
	return sellSteps.concat(buySteps);
};

PricingLadderParser.prototype._getLadderStepsResponseFrom = function(response){
	return response.split('|').slice(3);
};

PricingLadderParser.prototype._createLadderStepsFrom = function(ladderResponse, isBuyStep){
	var stepsResponse = ladderResponse.split(';');
	var steps = [];
	for(var i = 0; i < stepsResponse.length ; i++){	
		var stepData = stepsResponse[i].split('@');
		steps.push(isBuyStep ? new PricingStep(stepData[0], '', stepData[1]) : new PricingStep('', stepData[0], stepData[1]));
	}
	return steps;
};

var PricingStep = function(buyDepth, sellDepth, price){
	this.buyDepth = buyDepth;
	this.sellDepth = sellDepth;
	this.price = price;
};