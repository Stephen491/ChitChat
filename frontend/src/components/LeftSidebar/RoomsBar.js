import React from 'react';
import './RoomsBar.css'
import io from 'socket.io-client';

class RoomsBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            creatingRoom: false,
            selectedRoom: null,
            roomName: '' ,
            hidden: false,
            rooms: [],
        }

        this.createRoomButtonClicked = this.createRoomButtonClicked.bind(this);
        this.createRoomButtonClose = this.createRoomButtonClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        //retrieve rooms from Cassandra db 
        this.setState({
           
        })

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
          })
    }

    createRoomButtonClicked() {
        this.setState({creatingRoom: true})

    }

    createRoomButtonClose(event) {
        this.setState({creatingRoom: false})
        event.preventDefault();
    }

    render() {
        return( 
            <div className = 'container'>
                <div className='roomsbar-container' style={{width: this.props.width, minHeight: this.props.height}}>
                    <button className='createRoom' onClick={this.createRoomButtonClicked}>Create a new room</button>
                

                    <React.Fragment>{this.props.children}</React.Fragment>


                </div>
                <div className={this.state.creatingRoom? 'roomcreation-container-active': 'roomcreation-container-hidden'}>

                    <form className = 'roomcreation-form'>
                    <button name="closeRoomCreation" onClick={this.createRoomButtonClose}>X</button>
                    <h3>Room name</h3>
                    <input 
                        className="text-input"
                        type="text"
                        name="roomName"
                        onChange={this.handleChange}
                        value={this.state.roomName}
                        required
                    ></input>
                    <h3>User Tags</h3>
                    <button name= 'create'>Create Room</button>



                    </form>


                </div>
            </div>
            
        );

    }

    


}

export default RoomsBar;






