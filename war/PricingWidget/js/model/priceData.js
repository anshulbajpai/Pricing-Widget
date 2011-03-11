var PriceData = function(quantity, price){
	this.quantity = quantity;	
	this.price = price;
};

PriceData.prototype.hasLowerPriceThan = function(otherPrice){
	return this.price < otherPrice;
};

PriceData.prototype.hasHigherPriceThan = function(otherPrice){
	return this.price > otherPrice;
};

var BidData = function(){
	this.data = [];
};

BidData.prototype.add = function(data){
	this.data.push(data);
};

BidData.prototype.getLowestBidPrice = function(){
	var minPrice = 1000000;
	for(var i = 0; i < this.data.length; i++){
		var currentData = this.data[i];
		if(currentData.hasLowerPriceThan(minPrice))
			minPrice = currentData.price;
	}
	return minPrice;
};

var AskData = function(){
	this.data = [];
};

AskData.prototype.add = function(data){
	this.data.push(data);
};

AskData.prototype.getHighestAskPrice = function(){
	var maxPrice = 0;
	for(var i = 0; i < this.data.length; i++){
		var currentData = this.data[i];
		if(currentData.hasHigherPriceThan(maxPrice))
			maxPrice = currentData.price;
	}
	return maxPrice;
};