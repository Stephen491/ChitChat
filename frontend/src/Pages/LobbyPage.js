import React from 'react';
import './LobbyPage.css'
import RoomsBar from '../components/LeftSidebar/RoomsBar';
import UsersBar from '../components/RightSidebar/UsersBar';


class LobbyPage extends React.Component {
    render() {
        return (
            <div className = "lobby-container">
                <RoomsBar width='50' minHeight='100'>
                    <h3>Home</h3>
                    <h3>room2</h3>
                </RoomsBar>
                <h1 className="main-chat"> Lobby </h1>
                <UsersBar width='50' minHeight='100'>
                    <h3>Person1</h3>
                    <h3>Person2</h3>
                </UsersBar>
            </div>
        )
    }



}

export default LobbyPage;