var u = require('./util.jsx');
var R = require('ramda');
function castInt(i){
    return parseInt(i, 10);
}
var calculations = {
    round: function(num, place){ return Math.round(num * (place ? place : 100)) / (place ? place : 100); },

    visitsPerYear: function(data){
        return data.visitsPerYear ? data.visitsPerYear : 44;
    },

    space: function(){return '';},

    area: function(data){
        return castInt(data.width) * castInt(data.height);
    },

    perimeter: function(data){
        return 2 * (castInt(data.width) + castInt(data.height));
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
                         (mower && mower.width ? (mower.width / 12.0) : (21 / 12.0)));
    },

    totalStripeTime: function(data, mower){
        return this.round(this.stripeCount(data, mower) * this.stripeTime(data, mower));
    },

    perimeterIncluded: function(data, mower){
        var included = data.perimeterIncluded;
        return (included === true || included == 'true' || included == 'True' || included == 'T' ||
                included == 'yes' || included == 'Yes' || included == 'Y');
    },

    perimeterMinusCorners: function(data, mower){
        return this.perimeter(data, mower) - (4 * (mower && mower.length ? mower.length : 2));
    },

    totalPerimeterTime: function(data, mower){
        if (this.perimeterIncluded(data)){
            return this.round(this.perimeterMinusCorners(data, mower) / this.pushSpeedInFtPerMin(data, mower));
        } else {
            return 0;
        }
    },

    totalWeedTime: function(data, mower){
        var weedOccurance = data.weedOccurance ? data.weedOccurance : 1;
        var weedCount = this.area(data) / (1000 * weedOccurance);
        var weedDelay = data.weedDelay ? data.weedDelay : 0.5;
        return this.round(weedCount * weedDelay);
    },

    totalBagTime: function(data, mower){
        var grassAreaPerBag = data.grassAreaPerBag ? data.grassAreaPerBag : 1000;
        var bagTime = data.bagTime ? data.bagTime : 0.5;
        var bags = this.area(data) / grassAreaPerBag;
        bags = bags > 1 ? this.round(bags, 1) : 1;
        return this.round(bags * bagTime);
    },

    totalMowingTime: function(data, mower){
        return this.totalStripeTime(data, mower) +
            this.totalPerimeterTime(data, mower) +
            this.totalWeedTime(data, mower) +
            this.totalBagTime(data, mower);
    },

    priceOf: function(functionName, data, mower){
        return (mower && mower.hourlyRate ? mower.hourlyRate : 30) * this[functionName](data, mower);
    },
    annualPriceOf: function(functionName, data, mower){
        return this.visitsPerYear(data) * this.priceOf(functionName, data, mower);
    }

};
calculations = R.merge(calculations, {
    mowing: calculations.totalMowingTime,
    calculated: calculations.space
});
function prettyFuncOf(func, functionName, data, mower){
    return "$" + calculations[func](functionName, data, mower).toFixed(2);
}
var calculate = function(functionName, data, mower){
    functionName = u.camelize(functionName);
    var funcToPrice = u.lowerFirst(functionName.split("priceOf")[1]);
    var funcToPriceAnnual = u.lowerFirst(functionName.split("annualPriceOf")[1]);
    if (calculations[funcToPrice] !== undefined && calculations[functionName] === undefined){
        return prettyFuncOf("priceOf", funcToPrice, data, mower);

    } else if (calculations[funcToPriceAnnual] !== undefined && calculations[functionName] === undefined){
        return prettyFuncOf("annualPriceOf", funcToPriceAnnual, data, mower);

    } else if (calculations[functionName] !== undefined) {
        return u.pretty(functionName, calculations[functionName](data, mower));

    } else {
        return "function not implemented";
    }
};

module.exports = calculate;

