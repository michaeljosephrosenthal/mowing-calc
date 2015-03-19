var React = require('react/addons');
var R = require('ramda');

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
    }
};

module.exports = util;
