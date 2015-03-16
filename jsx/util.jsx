var React = require('react/addons');
var R = require('ramda');

function merge(a, b){
    return React.addons.update(a, {$merge: b});
}

module.exports = merge;

