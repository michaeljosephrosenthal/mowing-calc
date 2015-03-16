var React = require('react/addons');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');
var R = require('ramda');
var $ = require('jquery');
var Section = require('./Section.jsx');

window.React = React;
window.R = R;

function merge(a, b){
    return React.addons.update(a, {'$merge': b});
}

function justOwnData(obj){
    return R.pickBy(
        function(value, key){return typeof(value) != "function" && key != "__proto__";},
        obj
    );
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
                    console.log(lawn);
                    if (lawn && key != "__proto__")
                        return (
                            <Section
                                id={key} key={key}
                                type="lawn"
                                data={lawn}
                                declareEditing={self.handleEditing}
                                passUpProps={self.editState} />
                        );
                }, this.state.home.lawns)}
            </div>
        ) : <div/>;
    }
});

React.render(<App/>, document.getElementById('app'));
