var React = require('react');
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
        return { };
    },

    componentWillMount: function() { 
        var firebaseRef = new Firebase("https://service-calc.firebaseio.com/");
        var homesRef = firebaseRef.child('homes');
        this.bindAsObject(firebaseRef.child('configs'), "configs");
        this.bindAsObject(homesRef, 'homes');

        this.bindAsObject(homesRef.child('demo'), 'home');
        this.bindAsObject(firebaseRef.child('configs/mowers/gas'), 'config');
    },

    editState: function(key, state) {
        this.firebaseRefs.fixtures.child(key).update(
            React.addons.update(this.state.fixtures[key], {$merge: state})
        );
    },

    pushObject: function(table, data) {
        this.firebaseRefs[table].push(fixture);
    },
    removeObject: function(table, i) {
        this.firebaseRefs[table].child(i).remove();
    },

    handleEditing: function(i) { this.setState({editing: i}); },

    handleFormEdit: function(i, fixture) {
        if(fixture.remove)
            return this.removeFixture(i);
        if (fixture.clone){
            delete fixture.clone;
            this.addFixture(fixture);
        }
        return i ? this.editState(i, fixture) : this.addFixture(fixture);
    },

    handleGardenEdit: function(gardenState) {
        this.firebaseRefs.garden.update(
            React.addons.update(this.state.garden, {$merge: gardenState})
        );
    },

    render: function() {
        var self = this;
        return (
            <div className="container">
                <div className="row">
                    <div className="app col-md-12">
                        Hello World
                    </div>
                </div>
            </div>
        );
    }
});

React.render(<App url="fixtures.json" />, document.getElementById('app'));
