function PriceChart(container) {
    var data = [];
    var containerId = container;

    this.setDataPoint = function(seriesNumber, pointId, dataPoint) {
		if(data[seriesNumber] == null)
			data[seriesNumber] = [];
		if(data[seriesNumber][pointId] == null)	
			data[seriesNumber].push(dataPoint);
		else{
			data[seriesNumber].shift();
			data[seriesNumber].push(dataPoint);
		}	
    };
	
	this.reset = function(){
		data = [];
	};

    this.drawChart = function() {
        var options = {
            series : {
                map: { pointDimension: 5, active: true, show: true}
            }                        
        };
        $.plot($(containerId), data, options);
    };
}