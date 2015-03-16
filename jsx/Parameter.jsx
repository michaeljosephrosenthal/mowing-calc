var React = require('react');
var R = require('ramda');

function merge(a, b){
    return React.addons.update(a, {$merge: b});
}

var Paremeter = React.createClass({
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
        return this.state.editing ? (
            <div className="parameter form-group">
                <label className="col-md-4" >{this.props.id}</label>
                <div className="col-md-8">
                <input className="form-control" type="text"
                    onChange={newKeyChange}
                    value={this.state.buffer.key} />
                </div>
                <button className="btn btn-success" type="button" onClick={this.toggleEdit}>Stop Editing</button>
            </div>
        ) : (
            <div className="parameter">
                <input className="form-control" type="hidden" value={this.props.value} />
                <div className="col-md-4"> <b>{this.props.id}</b> </div>
                <div className="col-md-8" > {this.props.value} </div>
                <button className="btn btn-sm btn-success" type="button" onClick={this.toggleEdit}>Edit</button>
            </div>
        );
    }
});

module.exports = Parameter;
