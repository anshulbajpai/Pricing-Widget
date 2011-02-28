function PriceWidget(priceChart, parser) {
    var count = 0;

    this.updateGraph = function(data) {
        var priceData = parser.parse(data);
        var askData = priceData.getAskData();
        var bidData = priceData.getBidData();
        ++count;
        var maxBidQuantity = getMaxQuantity(bidData);
        var maxAskQuantity = getMaxQuantity(askData);
		for(var i =0; i < bidData.length; i++){
			updateGraphData(bidData[i], maxBidQuantity, i);
		}
		for(var j = 0; j < askData.length; j++){
			updateGraphData(askData[j], maxAskQuantity, i+j);
		}
        priceChart.drawChart();
    };
	
	this.resetGraph = function(){
		count = 0;
		priceChart.reset();
	};

    function getMaxQuantity(dataArray) {
        var max = 0;
        for (var i = 0; i < dataArray.length; i++) {
            var priceData = dataArray[i];
            if (priceData.getQuantity() > max) {
                max = priceData.getQuantity();
            }
        }
        return max;
    };

    function updateGraphData(pricePoint, max, pointId) {
        priceChart.setDataPoint((count-1)%10, pointId, [count, pricePoint.getPrice(), pricePoint.getQuantity() / max]);
    };
}