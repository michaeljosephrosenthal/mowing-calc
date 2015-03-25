var React = require('react/addons');
var R = require('ramda');
var u = require('./util.jsx');
var Section = require('./Section.jsx');
var Total = require('./Total.jsx');

var Well = React.createClass({
    getInitialState: function(){ return {}; },
    handleEditing: function(i) { this.setState({editing: i}); },
    render: function() {
        var self = this;
        var configKey = this.props.type == 'lawn' ? 'mower' : undefined;
        var totals = this.props.type == 'lawn' && self.props.calcHeaders ?
            <Total sections={this.props.sections} defaults={self.props.defaults}
                vars={R.map(u.camelize, self.props.varHeaders)}
                topCalculations={self.props.calcHeaders}
                configs={self.props.configs}
                configDefaults={self.props.configDefaults}
                configKey={configKey} /> :
            <span/>;
        return (
            <div className="well">
                <h2>{this.props.title}</h2>
                <ul className="list-inline row">
                    {R.map(function(header) {
                        leng = header.length > 18 ? 2 : 1;
                        return <li className={"col-md-" + leng + " header"}><b>{header}</b></li>;
                    }, this.props.varHeaders)}
                    {R.map(function(header) {
                        leng = header.length > 18 ? 2 : 1;
                        return <li className={"col-md-" + leng + " header"}><b>{header}</b></li>;
                    }, this.props.calcHeaders)}
                </ul>
                {totals}
                {R.mapObjIndexed(function(section, key) {
                    if (section && key != "__proto__"){
                        var sectionWithDefaults = u.nullIfEmtpyMerge(self.props.defaults, section);
                        var config = u.getConfig(self.props.configs, self.props.configDefaults, configKey, sectionWithDefaults);
                        return (
                            <Section id={key} key={key}
                                type={self.props.type}
                                data={sectionWithDefaults}
                                config={config}

                                vars={R.map(u.camelize, self.props.varHeaders)}
                                topCalculations={self.props.calcHeaders}
                                declareEditing={self.handleEditing}
                                passUpProps={self.props.passUpProps} 
                                removeFunc={self.props.removeFunc} />
                            );
                    }
                }, this.props.sections)}
                <ul className="list-inline row">
                    <li><a className="col-md-1" href="#add" onClick={this.props.addFunc}><h3> + </h3></a></li>
                </ul>
            </div>
        );
    }
});

module.exports = Well;
