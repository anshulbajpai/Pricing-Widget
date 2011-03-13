var BidData = function(){
	this.data = [];
};

BidData.prototype.add = function(data){
	this.data.push(data);
};

BidData.prototype._getBestPrice = function(){
	var minPrice = 1000000;
	for(var i = 0; i < this.data.length; i++){
		var currentData = this.data[i];
		if(currentData.hasLowerPriceThan(minPrice))
			minPrice = currentData.price;
	}
	return minPrice;
};

BidData.prototype.hasBetterPriceThan = function(otherBidData){
	return this._getBestPrice() <= otherBidData._getBestPrice();
};

