function PriceDataParser() {
    this.parse = function(data) {
        var dataParts = data.split('|');

        var bidData = parsePriceData(dataParts[3]);
        var askData = parsePriceData(dataParts[4]);

        return new PricePointData(bidData, askData)
    };

    function parsePriceData(priceDataString) {
        var priceDataPoints = priceDataString.split(';');

        var pricePoints = [];
		for(var i =0; i< priceDataPoints.length; i++){
			pricePoints.push(parsePricePoint(priceDataPoints[i]));
		}
        return pricePoints;
    };

    function parsePricePoint(pricePointString) {
        var pricePoint = pricePointString.split('@');
        return new PricePoint(parseInt(pricePoint[0]), parseFloat(pricePoint[1]));
    };
}