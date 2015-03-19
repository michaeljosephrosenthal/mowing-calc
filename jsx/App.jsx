var React = require('react/addons');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');
var R = require('ramda');
var $ = require('jquery');

var u = require('./util.jsx');
var Section = require('./Section.jsx');

window.React = React;
window.R = R;

defaults = {
    name: "New Lawn",
    width: 0,
    height: 0,
    stripeDirection: "V"
}


var App = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function() {
        return { home: undefined };
    },

    componentWillMount: function() { 
        var firebaseRef = new Firebase("https://service-calc.firebaseio.com/");
        var homesRef = firebaseRef.child('homes');
        this.bindAsObject(firebaseRef.child('configs'), "configs");
        this.bindAsObject(homesRef, 'homes');

        this.bindAsObject(homesRef.child('demo'), 'home');
        this.bindAsObject(firebaseRef.child('configs/mowers/gas'), 'config');
    },

    editState: function(key, obj) {
        this.firebaseRefs.homes.child('demo/lawns/' + key).update( obj );
    },

    pushObject: function(table, data) {
        this.firebaseRefs[table].push(fixture);
    },
    removeObject: function(table, i) {
        this.firebaseRefs[table].child(i).remove();
    },

    handleEditing: function(i) { this.setState({editing: i}); },

    addLawn: function(e) {
        e.preventDefault();
        this.firebaseRefs.home.child('lawns').push({
            name: "New Lawn",
            width: 0,
            height: 0,
            stripeDirection: "V"
        });
    },

    render: function() {
        var self = this;
        var home = this.state.home;
        return home ? (
            <div className="well container">
                <h1>Service Calculator for {this.state.home.name}</h1>
                <h2>Simple Lawns to Mow</h2>
                <ul className="list-inline row">
                    {R.map(function(header) {
                        return <li className="col-md-1"><b>{header}</b></li>;
                    }, ["Name", "Height", "Width", "Stripe Direction"])}
                    {R.map(function(header) {
                        return <li className="col-md-1"><b>{header}</b></li>;
                    }, ["Calculated:", "Stripe Time", "Price"])}
                </ul>
                {R.mapObjIndexed(function(lawn, key) {
                    if (lawn && key != "__proto__")
                        return (
                            <Section id={key} key={key}
                                type="lawn"
                                data={u.nullIfEmtpyMerge(defaults, lawn)}
                                declareEditing={self.handleEditing}
                                passUpProps={self.editState} />
                        );
                }, this.state.home.lawns)}
                <div className="row">
                    <a className="col-md-1" href="#add" onClick={this.addLawn}>+</a>
                </div>
            </div>
        ) : <div/>;
    }
});

React.render(<App/>, document.getElementById('app'));
