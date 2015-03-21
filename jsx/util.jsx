var React = require('react/addons');
var R = require('ramda');

function is(functionName, substrings){
    if (substrings instanceof Array){
        first = substrings.pop();
        rest = substrings;
        return (is(functionName, first) ||
                 (rest.length > 0 ? is(functionName, substrings) : false));
    } else {
        return functionName.indexOf(substrings) > -1;
    }
}
var util = {
    merge: function(a, b){
        return React.addons.update(a, {$merge: b});
    },
    nullIfEmtpyMerge: function(a, b){
        var patchedEmpties = R.mapObjIndexed(function(val, key) {
            return val === 0 || val.length < 1 ? a[key] : val;
        }, b);
        return React.addons.update(a, {$merge: patchedEmpties});
    },
    justOwnData: function(obj){
        return R.pickBy(
            function(value, key){return typeof(value) != "function" && key != "__proto__";},
            obj
        );
    },
    lowerFirst: function(string) {
        return string ? string.charAt(0).toLowerCase() + string.slice(1) : string;
    },
    camelize: function(str) {
        return str ? str.toLowerCase()
            .replace( /['"]/g, '' )
            .replace( /\W+/g, ' ' )
            .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
            .replace( / /g, '' ) : str;
    },
    pretty: function(functionName, value){
        if ( is( functionName, "Time")){
            return value.toFixed(2) + " min";
        } else if ( is( functionName, "FtPerMin")) {
            return value.toFixed(2) + " ft / min";
        } else if ( is( functionName, ["width", "height", "Length"])) {
            return value + " ft";
        } else {
            return value.toString();
        }
    }

};

module.exports = util;
