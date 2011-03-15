function createXmlHttpRequest()
{
	if (window.XMLHttpRequest)
	{
		return new window.XMLHttpRequest();
	}

	try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {}

	alert("XMLHttpRequest not supported");

	return null;
}

String.prototype.trim = function()
{
	return this.replace(/^\s/, "").replace(/\s*$/, "");
};

var tableHeaderTitles = ["Instrument", "Spread"];

var sendCallbackTimerId = -1;
var displayDiv;
var xhr;
var xhrCounter = 1;
var baseUrl = "http://marketdata.lmaxtrader.com/";
var pollUrl = baseUrl + "longPoll/";

var pricingLadderWidget = new PricingLadderWidget(new PricingLadderRenderer());
var priceChartWidget = new PriceChartWidget(new PriceChart("#price-chart"));

var pricingUrlTemplate = new Url(pollUrl + '?init=true');
var pricingAjaxWrapper = new AjaxWrapper();
var pricingDataParser = new PricingDataParser();
var priceWidgets =  new PriceWidgets([pricingLadderWidget, priceChartWidget]);

var priceWidgetController = new PriceWidgetController(pricingUrlTemplate, pricingAjaxWrapper, pricingDataParser, priceWidgets);

var selectedInstrument = null;

var verifier = null;

function longPollCallback()
{
	if (!xhr || 4 != xhr.readyState)
	{
		return;
	}

	if (200 == xhr.status)
	{
		var trimmedText = xhr.responseText.trim();
		if (trimmedText.length > 0)
		{
			processResponseData(trimmedText);
		}
	}
	else
	{
		xhr.onreadystatechange = null;

		if (-1 != sendCallbackTimerId)
		{
			clearTimeout(sendCallbackTimerId);
		}

		sendCallbackTimerId = setTimeout(new function()
		{
			window.location.reload();
		}, 1000);
	}

	xhr.onreadystatechange = null;

	if (-1 != sendCallbackTimerId)
	{
		clearTimeout(sendCallbackTimerId);
	}
	sendCallbackTimerId = setTimeout(sendLongPoll, 100);
}

function sendLongPoll()
{
	xhr = createXmlHttpRequest();
	xhr.open("GET", '../priceWidget?url=' + pollUrl + xhrCounter++ + '&init=true' , true);
	xhr.onreadystatechange = longPollCallback;
	xhr.send("");
}

function startWidget()
{
	verifier = new Verifier();
	displayDiv = document.getElementById("data");
	xhr = createXmlHttpRequest();
	xhr.open("GET", '../priceWidget?url=' + pollUrl + xhrCounter++ + '&init=true', true);
	xhr.onreadystatechange = longPollCallback;
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("");
}

function processResponseData(responseData)
{
	var instruments = parseInstruments(responseData);
	var fragment = createTableFragment(instruments);
	displayDiv.replaceChild(fragment, displayDiv.firstChild);
}

function addHeadersToTable(tableTag, headers)
{
	var tableHeaderTag = document.createElement("tr");
	tableTag.appendChild(tableHeaderTag);

	for (var i = 0, size = headers.length; i < size; i++)
	{
		var tableHeaderDataTag = document.createElement("td");
		tableHeaderDataTag.setAttribute("class", "table_header");
		tableHeaderTag.appendChild(tableHeaderDataTag);
		tableHeaderDataTag.appendChild(document.createTextNode(headers[i]));
	}
}

function createTableFragment(instruments)
{                                                       
	var fragment = document.createDocumentFragment();
	var tableTag = document.createElement("table");
	fragment.appendChild(tableTag);
	addHeadersToTable(tableTag, tableHeaderTitles);
	for (var i = 0, size = instruments.length; i < size; i++)
	{
		addInstrumentToTable(tableTag, instruments[i], i);
	}
	return fragment;
}

function Instrument(data)
{
	var dataItems = data.split("|");
	this.orderBookId = dataItems[0];
	this.status = dataItems[1];
	this.commonName = dataItems[2];
	if(this.status == "Closed")
		this.spread = "NA";
	else{
		var spread = calculateSpread(parseTradeData(dataItems[3]), parseTradeData(dataItems[4]));
		this.spread = Math.round(spread*Math.pow(10,5))/Math.pow(10,5);
	}
}

function calculateSpread(bidData, askData){
	
	return calculatePrice(askData[askData.length-1]) - calculatePrice(bidData[0]);
}

function parseTradeData(data){
	return data.split(';');
}

function calculatePrice(data){	
	return parseFloat(data.split('@')[1]);
	
}

function parseInstruments(responseData)
{
	var instruments = new Array();
	var dataLines = responseData.split("\n");
	for (var i = 0, size = dataLines.length; i < size; i++)
	{
		instruments[i] = new Instrument(dataLines[i]);
	}
	return instruments;
}

function addInstrumentToTable(tableTag, instrument, rowIndex)
{
	var rowTag = document.createElement("tr");
	rowTag.setAttribute("class", (0 == rowIndex % 2) ? "even_row" : "odd_row");
	tableTag.appendChild(rowTag);

	var tableCell = document.createElement("td");
	tableCell.setAttribute("class", "instrument_column");
	if(selectedInstrument && instrument.orderBookId == selectedInstrument.childNodes[1].innerHTML)
		tableCell.className += " selected_instrument";
	rowTag.appendChild(tableCell);
	var rowImg = document.createElement("img");
	rowImg.setAttribute("class", "status_img");
	rowImg.src = baseUrl + instrument.status + ".png";
	tableCell.appendChild(rowImg);
	var instrumentIdentifierSpan = tableCell.appendChild(document.createElement('span'));
	instrumentIdentifierSpan.className = 'hidden';
	instrumentIdentifierSpan.innerHTML = instrument.orderBookId;
	tableCell.appendChild(document.createTextNode(instrument.commonName));
	$(tableCell).hover(mouseEnterOnInstrument, mouseLeaveOnInstrument);
	$(tableCell).click(handleClickForInstrument);	
	
	tableCell = document.createElement("td");
	rowTag.appendChild(tableCell);
	tableCell.appendChild(document.createTextNode(instrument.spread));
	var spreadClasses = "spread_column";	
	if (instrument.spread <= 0.0)
	{
		spreadClasses += " choice_market";
	}
	tableCell.setAttribute("class", spreadClasses);
}

function mouseEnterOnInstrument(){
	$(this).addClass(getInstrumentHoverClass());
}

function mouseLeaveOnInstrument(){
	$(this).removeClass(getInstrumentHoverClass());
}

function handleClickForInstrument(){
	if(selectedInstrument)
		$(selectedInstrument).removeClass(getInstrumentClickClass());
	selectedInstrument = this;
	$(selectedInstrument).removeClass(getInstrumentHoverClass());
	$(selectedInstrument).addClass(getInstrumentClickClass());	
	priceWidgetController.show(selectedInstrument.childNodes[1].innerHTML);
}

function getInstrumentHoverClass(){
	return 'instrument_column_hover';
}

function getInstrumentClickClass(){
	return 'selected_instrument';
}
