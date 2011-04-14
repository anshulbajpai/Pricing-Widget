var StringBuilder = function(value)
{
    this.strings = new Array("");
    this.append(value);
};

StringBuilder.prototype.append = function(value) {
    if (value) {
        this.strings.push(value);
    }
    return this;
};

StringBuilder.prototype.toString = function() {
    return this.strings.join("");
}