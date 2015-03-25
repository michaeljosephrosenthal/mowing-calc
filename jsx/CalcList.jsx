var React = require('react');
var R = require('ramda');
var calculate = require('./calculations.jsx');

var list = [
    'Area',
    'Perimeter',
    'Vertical Vs Horizontal',
    'Diameter One',
    'Diameter Two',
    'Push Speed',
    'Push Speed In Ft Per Min',
    'Turn Delay',
    'Turn Delay In Sec',
    'Side Length',
    'Side Time',
    'Stripe Time',
    'Stripe Count',
    'Total Stripe Time',
    'Total Perimeter Time',
    'Total Weed Time',
    'Total Bag Time',
    'Total Mowing Time',
    'Price Of Mowing',
    'Annual Price Of Mowing'
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
            <div className="col-md-5">
                <h6><a href="#" onClick={this.toggleView}>Toggle Calculated Values</a></h6>
                {this.state.viewing ?
                    <dl className="col-md-12">
                        {R.map(function(calc) {
                            return <span className="drow">
                                <dt className="col-md-6">{calc}:</dt>
                                <dd className="col-md-6">{calculate(calc, self.props.data, self.props.config)}</dd>
                            </span>;
                        }, list)}
                    </dl> : <span/> }
            </div>
        );
    }
});

module.exports = CalcList;
