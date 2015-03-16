var React = require('react');
var R = require('ramda');
var calculations = require('./calculations.jsx');

var list = [
    'area',
    'perimeter',
    'verticalVsHorizontal',
    'diameterOne',
    'diameterTwo',
    'pushSpeed',
    'pushSpeedInFtPerMin',
    'turnDelay',
    'turnDelayInSec',
    'sideLength',
    'sideTime',
    'stripeTime',
    'stripeCount',
    'totalStripeTime',
    'price'
];
var CalcList = React.createClass({
    getInitialState: function() {
        return { viewing: false };
    },
    toggleView: function(event) {
        event.preventDefault();
        this.setState({viewing: !this.state.viewing});
    },
    render: function() {
        var self = this;
        return (
            <div className="col-md-6">
                <h6><a href="#" onClick={this.toggleView}>Toggle Calculated Values</a></h6>
                {this.state.viewing ?
                    <dl className="dl-horizontal">
                        {R.map(function(calc) {
                            return [
                                <dt>{calc}</dt>,
                                <dd>{calculations[calc](self.props.data, self.props.mower)}</dd>
                                ];
                        }, list)}
                    </dl> : <span/> }
            </div>
        );
    }
});

module.exports = CalcList;
