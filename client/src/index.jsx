import React from 'react';
import ReactDom from 'react-dom';
import ChatRoom from './components/ChatRoom.jsx';

const App = () => {
    return (
        <div>
            <ChatRoom />
        </div>
    );
};

ReactDom.render(<App />, document.getElementById('_root'));
