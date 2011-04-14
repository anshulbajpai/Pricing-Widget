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
var priceChartWidget = new PriceChartWidget(new PriceChart("#price-chart-container"));

var pricingUrlTemplate = new Url(pollUrl);
var pricingAjaxWrapper = new AjaxWrapper();
var pricingDataParser = new PricingDataParser();
var instrumentParser = new InstrumentParser();
var priceWidgets =  new PriceWidgets($([pricingLadderWidget, priceChartWidget]));

var priceWidgetController = new PriceWidgetController(pricingUrlTemplate, pricingAjaxWrapper, pricingDataParser, instrumentParser, priceWidgets);

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
			priceWidgetController.updateInstrumentTable(trimmedText);
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

