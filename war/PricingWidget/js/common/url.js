var Url = function(url){
	this.url = url;
};

Url.prototype.randomize = function(){
	return new Url(this.url + '&rand=' + this._getRandomNumber());
};

Url.prototype._getRandomNumber = function(){
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

Url.prototype.value = function() {    
    return this.url;
};
