var calculations = {
    round: function(num, place){ return Math.round(num * (place ? place : 100)) / (place ? place : 100); },
    space: function(){return '';},
    area: function(data){
        return data.width * data.height;
    },
    perimeter: function(data){
        return 2 * (data.width + data.height);
    },
    verticalVsHorizontal: function(data){
        var stripeDirection = data.stripeDirection;
        return (stripeDirection != 'H' || 
                stripeDirection != 'Horizontal' ||
                stripeDirection != 'h' || 
                stripeDirection != 'horizontal');
    },
    diameterOne: function(data){
        var stripeDirection = data.stripeDirection,
            width = data.width,
            height = data.height;
        return this.verticalVsHorizontal(stripeDirection) ? width : height;
    },
    diameterTwo: function(data){
        var stripeDirection = data.stripeDirection,
            width = data.width,
            height = data.height;
        return this.verticalVsHorizontal(stripeDirection) ? height : width;
    },
    pushSpeed: function(data, mower){
        return (mower && mower.pushSpeed ? mower.pushSpeed : 3.1);
    },
    pushSpeedInFtPerMin: function(data, mower){
        return this.pushSpeed(data, mower) * 60;
    },
    turnDelay: function(data, mower){
        return (mower && mower.turnDelay ? mower.turnDelay : 3);
    },
    turnDelayInSec: function(data, mower){
        return this.turnDelay(data, mower) / 60.0;
    },
    sideLength: function(data, mower){
        var length = this.diameterOne(data) - (mower && mower.length ? mower.length : 2);
        return  length > 0 ? length : 0;
    },
    sideTime: function(data, mower){
        return this.sideLength(data, mower) / this.pushSpeedInFtPerMin(data, mower);
    },
    stripeTime: function(data, mower){
        return this.sideTime(data, mower) + (2 * this.turnDelayInSec(data, mower));
    },
    stripeCount: function(data, mower){
        return Math.ceil(this.diameterTwo(data, mower) /
                         (mower && mower.width ? mower.width / 12.0 : 21 / 12.0));
    },
    totalStripeTime: function(data, mower){
        return this.round(this.stripeCount(data, mower) * this.stripeTime(data, mower));
    },
    price: function(data, mower){return 30 * this.totalStripeTime(data, mower);}
};
module.exports = calculations;
