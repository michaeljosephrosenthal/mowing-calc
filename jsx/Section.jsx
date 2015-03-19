var React = require('react');
var R = require('ramda');
var Parameter = require('./Parameter.jsx');
var CalcList = require('./CalcList.jsx');
var calculations = require('./calculations.jsx');

var Section = React.createClass({
    getInitialState: function() {
        return { editing: false };
    },
    handleInputChange: function(key, value) {
        var obj = {};
        obj[key] = value;
        this.props.passUpProps(this.props.id, obj);
    },
    toggleEdit: function(event) {
        event.preventDefault();
        this.setState({editing: !this.state.editing});
    },
    render: function() {
        var self = this;
        return this.state.editing ? (
            <div className="col-md-12">
                <form className="form-vertical col-md-6">
                    <h3><a href="#" onClick={this.toggleEdit}>{this.props.data.name}</a></h3>
                    {R.mapObjIndexed(function(parameter, key) {
                        return <Parameter key={key} id={key} value={parameter} onChange={self.handleInputChange}/>;
                    }, this.props.data)}
                </form>
                <CalcList data={this.props.data} mower={this.props.mower} />
            </div>
        ) : (
            <ul className="list-inline row">
                <li className="col-md-1">
                    <b className="col-md-3"><a href="#" onClick={this.toggleEdit}>{this.props.data.name}</a></b>
                </li>
                {R.map(function(parameter) {
                    return <li className="col-md-1 parameter">{self.props.data[parameter]}</li>;
                }, ['width', 'height', 'stripeDirection'])}
                {R.map(function(calc) {
                    return <li className="col-md-1 calculation">{calculations[calc](self.props.data, self.props.mower)}</li>;
                }, ['space', 'totalStripeTime', 'price'])}
            </ul>
        );
    }
});

module.exports = Section;
