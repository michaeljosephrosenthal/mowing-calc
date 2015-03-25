var React = require('react');
var R = require('ramda');
var Parameter = require('./Parameter.jsx');
var CalcList = require('./CalcList.jsx');
var calculate = require('./calculations.jsx');
var u = require('./util.jsx');
window.t = [];

var Total = React.createClass({
    withDefaults: function(section){
        return u.nullIfEmtpyMerge(this.props.defaults, section);
    },
    getConfig: function(section){
        var props = this.props;
        return u.getConfig(props.configs, props.configDefaults, props.configKey, this.withDefaults(section));
    },
    render: function() {
        var props = this.props;
        var self = this;
        return (
            <ul className="list-inline row section">
                <li className="col-md-1">
                    <b className="col-md-3">Totals:</b>
                </li>
                {R.map(function(parameter) {
                    if (!R.contains(parameter)(["name"])){
                        leng = parameter.length > 18 ? 2 : 1;
                        return <li className={"col-md-" + leng + " parameter"}></li>;
                    }
                }, props.vars)}
                {R.map(function(calc) {
                    leng = calc.length > 18 ? 2 : 1;
                    return (
                        <li className={"col-md-" + leng + " calculation"}><b>
                            {u.pretty(u.camelize(calc),
                                R.reduce(u.add, 0.0, R.values(
                                    R.mapObjIndexed(function(section, key) {
                                        if (section && key != "__proto__"){
                                            return calculate(calc, self.withDefaults(section), self.getConfig(section), true);
                                        }
                            }, props.sections))))}
                        </b></li>
                      );
                }, props.topCalculations)}
            </ul>
        );
    }
});

module.exports = Total;
