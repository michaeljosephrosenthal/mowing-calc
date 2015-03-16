var React = require('react');
var R = require('ramda');

var Parameter = React.createClass({
    getInitialState: function() {
        return { editing: false };
    },
    handleInputChange: function(event) {
        this.props.onChange(this.props.id, event.target.value);
    },
    toggleEdit: function(event) {
        event.preventDefault();
        this.setState({editing: !this.state.editing});
    },
    render: function() {
        return (
            <div className="row">
                <a className="col-md-4" href={"#editing-" + this.props.id} onClick={this.toggleEdit}>
                    <b>{this.props.id}</b>
                </a>
                <div className="col-md-8" > 
                    { this.state.editing ? 
                        <input className="form-control" type="text"
                            onChange={this.handleInputChange}
                            value={this.props.value} />
                        : this.props.value }
                </div>
            </div>
        );
    }
});

module.exports = Parameter;
