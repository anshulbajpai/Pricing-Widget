var Url = function(url){
	this.url = url;
};

Url.prototype.randomize = function(){
	this.url = this.url + '&rand=' + this._getRandomNumber();
	return this;
};

Url.prototype._getRandomNumber = function(){
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

Url.prototype.format = function() {
    var formatted = this.url;
    for(var i = 0; i < arguments.length; i++) {
        formatted = formatted.replace("{" + i + "}", arguments[i]);
    }
    return formatted;
};