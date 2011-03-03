var PriceDataParser = function() {};

PriceDataParser.prototype.parse = function(data) {
        var dataParts = data.split('|');

        var bidData = this._parsePriceData(dataParts[3]);
        var askData = this._parsePriceData(dataParts[4]);

        return { bidData: bidData, askData: askData };
};

PriceDataParser.prototype._parsePriceData = function(priceDataString) {
        var priceDataPoints = priceDataString.split(';');

        var pricePoints = [];
		for(var i =0; i< priceDataPoints.length; i++){
			pricePoints.push(this._parsePricePoint(priceDataPoints[i]));
		}
        return pricePoints;
    };

PriceDataParser.prototype._parsePricePoint = function(pricePointString) {
        var pricePoint = pricePointString.split('@');
        return { quantity: parseInt(pricePoint[0]), price: parseFloat(pricePoint[1]) };
};