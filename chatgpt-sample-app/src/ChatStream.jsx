import { useState, useEffect } from 'react';

const ChatStream = (prompt) => {
  const [messages, setMessages] = useState([]);
  const wsUrl = 'wss://YOUR API GATEWAY URL';

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      // WebSocketが接続されたらメッセージを送信
      ws.send(JSON.stringify({ action: "sendmessage", data: prompt }));
    };

    ws.onmessage = (event) => {
      const message = event.data;
      setMessages(prevMessages => [...prevMessages, message]);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      ws.close();
    };
  }, [prompt, wsUrl]);

  return (
    <div>
      <h2>Chat Stream</h2>
      {messages}
    </div>
  );
};

export default ChatStream;
