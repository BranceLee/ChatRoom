import React, { useEffect, useState } from 'react';
import SocketClient from '../../utils/socket';

let client = null;

export default function ChatRoom() {
    const [roomID] = ['1'];
    const [msgHistory, setMsgHistory] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        client = new SocketClient();

        client.socket.emit('getHistory', {
            roomID
        });

        client.addMessage(serverData => {
            const { error, data } = serverData;
            console.log(data);
            if (error) {
                window.alert(error);
                return;
            }
            console.log('msgHistory', data);
            setMsgHistory(preMsgHistory => [
                ...preMsgHistory,
                ...data.msgHistory
            ]);
        });

        return () => {
            client.unregisterHandler();
            client = null;
        };
    }, []);

    const MessageHistoryList = () => {
        if (msgHistory.length === 0) return <div>No more message</div>;
        return msgHistory.map((msg, index) => {
            const timer = new Date(msg.message.timeStamp);
            const time = timer.getHours() + ':' + timer.getMinutes();
            return (
                <div key={index}>
                    <div>{time}</div>
                    <div>{msg.message.content}</div>
                </div>
            );
        });
    };

    const sendMsg = e => {
        e.preventDefault();
        console.log(client);
        client.socket.emit('channel', {
            roomID,
            feed: {
                userID: '1',
                message
            }
        });
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
