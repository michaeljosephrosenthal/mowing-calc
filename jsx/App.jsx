var React = require('react/addons');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');
var R = require('ramda');
var $ = require('jquery');

var u = require('./util.jsx');
var Section = require('./Section.jsx');

window.React = React;
window.R = R;

var defaults = {
    name: "New Lawn",
    width: 0,
    height: 0,
    stripeDirection: "V",
    perimeterIncluded: true,
    visitsPerYear: 1
};
var varHeaders = ["Name", "Height", "Width", "Stripe Direction", "Perimeter Included"];
var calcHeaders = ["Calculated:", "Stripe Time", "Price of Mowing", "Annual Price of Mowing"];

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
    removeLawn: function(i) {
        this.firebaseRefs.home.child('lawns').child(i).remove();
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
                        leng = header.length > 18 ? 2 : 1;
                        return <li className={"col-md-" + leng + " header"}><b>{header}</b></li>;
                    }, varHeaders)}
                    {R.map(function(header) {
                        leng = header.length > 18 ? 2 : 1;
                        return <li className={"col-md-" + leng + " header"}><b>{header}</b></li>;
                    }, calcHeaders)}
                </ul>
                {R.mapObjIndexed(function(lawn, key) {
                    if (lawn && key != "__proto__")
                        return (
                            <Section id={key} key={key}
                                type="lawn"
                                data={u.nullIfEmtpyMerge(defaults, lawn)}
                                vars={R.map(u.camelize, varHeaders)}
                                topCalculations={calcHeaders}
                                declareEditing={self.handleEditing}
                                passUpProps={self.editState} 
                                removeLawn={self.removeLawn} />
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
