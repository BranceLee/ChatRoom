import React, { useEffect, useState } from 'react';
import SocketClient from '../../utils/socket';

let client = null;

export default function ChatRoom() {
    const [msgHistory, setMesHistory] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        client = new SocketClient();

        return () => {
            client.unregisterHandler();
            client = null;
        };
    }, []);

    useEffect(() => {
        client.addMessage(severMsg => {
            setMesHistory([...msgHistory, severMsg]);
        });
    });

    const MessageHistoryList = () => {
        if (msgHistory.length === 0) return <div>No more message</div>;
        return msgHistory.map((msg, key) => <div key={key}>{msg}</div>);
    };

    const sendMsg = e => {
        e.preventDefault();
        console.log(client);
        client.socket.emit('channel', message);
    };

    return (
        <div>
            <form>
                <input
                    type="text"
                    id="input"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button type="submit" id="btn" onClick={sendMsg}>
                    send
                </button>
            </form>
            <div id="wrap">
                <MessageHistoryList />
            </div>
        </div>
    );
}
