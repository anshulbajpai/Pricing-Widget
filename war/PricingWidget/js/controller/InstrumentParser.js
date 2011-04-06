var InstrumentParser = function(){};

InstrumentParser.prototype.parseInstruments = function(response){
	var instruments = new Array();
	var dataLines = response.split("\n");
	for (var i = 0, size = dataLines.length; i < size; i++)
	{
		instruments[i] = new Instrument(dataLines[i]);
	}
	return instruments;
};

