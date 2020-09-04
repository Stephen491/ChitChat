import React from 'react';
import './RoomsBar.css'

class RoomsBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            creatingRoom: false,
            selectedRoom: null,
            hidden: false,
        }
    }

    componentWillMount(){
        //retrieve rooms from Cassandra db 

    }

    render() {
        return( 
            <div class='container' style={{width: this.props.width, minHeight: this.props.height}}>
                <React.Fragment>{this.props.children}</React.Fragment>


            </div>

        );

    }
}

export default RoomsBar;






