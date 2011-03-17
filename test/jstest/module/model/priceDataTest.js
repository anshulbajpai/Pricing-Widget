$(document).ready(function(){

module("PriceDataContainer Test",{
        setup: function() {
			timer = new Mock();
			priceDataContainer = new PriceDataContainer(timer);			
		},
        teardown: function() {
			timer.verify();
			timer.reset();
		}
	});
	
test("should return the same set after one second if there is only one set", function(){
	
	equal(true, false);
});

});