var React = require('react');
var R = require('ramda');
var Parameter = require('./Parameter.jsx');
var CalcList = require('./CalcList.jsx');
var calculate = require('./calculations.jsx');
var u = require('./util.jsx');

var Section = React.createClass({
    getInitialState: function() {
        return { editing: false };
    },
    handleInputChange: function(key, value) {
        var obj = {};
        obj[key] = value;
        this.props.passUpProps(this.props.id, obj);
    },
    remove: function(e) {
        this.props.removeFunc(this.props.id);
    },
    toggleEdit: function(event) {
        event.preventDefault();
        this.props.declareEditing(this.props.id);
        this.setState({editing: !this.state.editing});
    },
    render: function() {
        var self = this;
        return this.state.editing ? (
            <div className="col-md-12 section">
                <form className="form-vertical col-md-5">
                    <h3><a href="#" onClick={this.toggleEdit}>{this.props.data.name}</a></h3>
                    {R.mapObjIndexed(function(parameter, key) {
                        if (!R.contains(key)(["key"])){
                            return <Parameter key={key} id={key} value={parameter} onChange={self.handleInputChange}/>;
                        }
                    }, this.props.data)}
                </form>
                <CalcList data={this.props.data} config={this.props.config} />
                <div className="col-md-2">
                    <h4><a href="#" style={{color:"red"}} onClick={this.remove}>(Remove)</a></h4>
                </div>
            </div>
        ) : (
            <ul className="list-inline row section">
                <li className="col-md-1">
                    <b className="col-md-3"><a href="#" onClick={this.toggleEdit}>{this.props.data.name}</a></b>
                </li>
                {R.map(function(parameter) {
                    if (!R.contains(parameter)(["name"])){
                        leng = parameter.length > 18 ? 2 : 1;
                        return <li className={"col-md-" + leng + " parameter"}>{u.pretty(parameter, self.props.data[parameter])}</li>;
                    }
                }, this.props.vars)}
                {R.map(function(calc) {
                    leng = calc.length > 18 ? 2 : 1;
                    return <li className={"col-md-" + leng + " calculation"}>{calculate(calc, self.props.data, self.props.config)}</li>;
                }, this.props.topCalculations)}
                <li className="col-md-1 pull-right">
                    <h5><a href="#" style={{color:"red"}} onClick={this.remove}>(Remove)</a></h5>
                </li>
            </ul>
        );
    }
});

module.exports = Section;
