var React = require('react/addons');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');
var R = require('ramda');
var $ = require('jquery');

var u = require('./util.jsx');
var Well = require('./Well.jsx');

window.React = React;
window.R = R;

var App = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function() {
        return { 
            home: undefined,
            configs: {},
            defaults: {
                lawns: {
                    name: "New Lawn",
                    mower: "gas",
                    width: 0,
                    height: 0,
                    stripeDirection: "V",
                    perimeterIncluded: true,
                    visitsPerYear: 44
                },
                mowers: {
                    name: "New Mower",
                    width: 19,
                    length: 2,
                    pushSpeed: 3.1,
                    ninetyDegTurnDelay: 3,
                    weeksPerYear: 44,
                    grassPerBag: 1000,
                    grassEmptyTime: 0.5,
                    unloading: 1.0,
                    reloading: 1.0,
                    carryDistance: 50
                }
            },
            views: {
                lawn: {
                    varHeaders: ["Name", "Height", "Width", "Stripe Direction", "Perimeter Included"],
                    calcHeaders: ["Calculated:", "Total Mowing Time", "Price of Mowing", "Annual Price of Mowing"]
                },
                mower: {
                    varHeaders: [
                        "Name", "Width", "Length", "Push Speed", "Ninety Deg Turn Delay", "Weeks Per Year", "Grass Per Bag",
                        "Grass Empty Time", "Unloading", "Reloading", "Carry Distance"
                    ]
                }
            }
        };
    },

    componentWillMount: function() { 
        var firebaseRef = new Firebase('https://service-calc.firebaseio.com/');
        var homesRef = firebaseRef.child('homes');
        this.bindAsObject(firebaseRef.child('configs'), 'configs');
        this.bindAsObject(homesRef, 'homes');

        this.bindAsObject(homesRef.child('demo'), 'home');
    },

    editLawnState: function(key, obj) {
        this.firebaseRefs.homes.child('demo/lawns/' + key).update( obj );
    },
    editMowerState: function(key, obj) {
        this.firebaseRefs.configs.child('mowers/' + key).update( obj );
    },

    pushObject: function(table, data) {
        this.firebaseRefs[table].push(fixture);
    },
    removeObject: function(table, i) {
        this.firebaseRefs[table].child(i).remove();
    },


    add: function(section, type) {
        this.firebaseRefs[section].child(type).push(this.state.defaults[type]);
    },
    remove: function(section, type, i) {
        this.firebaseRefs[section].child(type).child(i).remove();
    },

    addLawn: function(e) {
        e.preventDefault();
        this.add('home', 'lawns');
    },
    addMower: function(e) {
        e.preventDefault();
        this.add('configs', 'mowers');
    },
    removeLawn: function(i) {
        this.remove('home', 'lawns', i);
    },
    removeMower: function(i) {
        this.remove('configs', 'mowers', i);
    },

    render: function() {
        var self = this;
        var home = this.state.home;
        var mowers = this.state.configs.mowers;
        return home ? (
            <div className="container">
                <h1>Service Calculator for {this.state.home.name}</h1>
                <Well key="lawns" type="lawn" title="Simple Lawns to Mow"
                    sections={this.state.home.lawns}
                    configs={u.childNamesToKeys(this.state.configs.mowers)}
                    defaults={this.state.defaults.lawns}
                    configDefaults={this.state.defaults.mowers}

                    addFunc={self.addLawn} removeFunc={self.removeLawn} 
                    
                    calcHeaders={this.state.views.lawn.calcHeaders}
                    varHeaders={this.state.views.lawn.varHeaders}
                    passUpProps={self.editLawnState} />

                <Well key="configs" type="mower" title="Mower Configurations"
                    sections={this.state.configs.mowers}
                    defaults={this.state.defaults.mowers}

                    removeFunc={self.removeMower} addFunc={self.addMower}

                    calcHeaders={[]}
                    varHeaders={this.state.views.mower.varHeaders}
                    passUpProps={self.editMowerState} />
            </div>
        ) : <div/>;
    }
});

React.render(<App/>, document.getElementById('app'));
