function PricePointData(bidData, askData) {
    this.getBidData = function() {
        return bidData;
    };

    this.getAskData = function() {
        return askData;
    }
}

function PricePoint(quantity, price) {
    this.getPrice = function() {
        return price;
    };

    this.getQuantity = function() {
        return quantity;
    }
}