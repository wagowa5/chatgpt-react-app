import React from 'react'
import { useState, useEffect } from 'react'
import './App.css'
// import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([[]]);
  const [canSend, setCanSend] = useState(true);

  const [ws, setWs] = useState(null);
  const WSS_URL = import.meta.env.VITE_CHAT_STREAM_URL

  useEffect(() => {
    // WebSocket接続を開始
    const ws = new WebSocket(WSS_URL);
    setWs(ws);

    ws.onopen = () => console.log('WebSocket Connected');
    ws.onclose = () => console.log('WebSocket Disconnected');
    ws.onmessage = (event) => {
      /**
       * メッセージの形式:
       *  {
       *    "chunk": string,
       *    "isStopped": boolean
       *  }
       */
      const response = JSON.parse(event.data);

      if(!response.isStopped) {
        setCanSend(false);
        setMessages(prevMessages => {
          // 最後のメッセージが現在のプロンプトに対応するか確認
          const lastMessageIndex = prevMessages.length - 1;
          // 既存のレスポンスに新しいチャンクを追加
          const updatedLastMessage = [
            prevMessages[lastMessageIndex][0],
            (prevMessages[lastMessageIndex][1] || '') + response.chunk
          ];
          return [
            ...prevMessages.slice(0, lastMessageIndex),
            updatedLastMessage
          ];
        });
        console.log('WebSocket Message:', response);
      } else {
        setCanSend(true);
      }
    };
    ws.onerror = (error) => console.error('WebSocket Error:', error);

    // コンポーネントのアンマウント時にWebSocketをクローズ
    return () => ws.close();
  }, []); // 空の依存配列で一度だけ実行

  const handlePrompt = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // 送信後に再送信を防ぐために送信ボタンを無効化
      setCanSend(false);

      setMessages(prevMessages => [...prevMessages, [prompt]]);
      ws.send(JSON.stringify({ action: "sendmessage", data: prompt }));
      
      // 送信後テキストボックスをクリア
      setPrompt("");
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  return (
    <>
      <div className="chat-container">
        <header className="chat-header">
          <h1>ChatGPT App</h1>
        </header>

        <div className="message-form">
          <input
            type="text"
            value={prompt}
            className="message-input"
            placeholder="Please input prompt..."
            onChange={(e) => setPrompt(e.target.value)}
          ></input>
          <button disabled={prompt.trim() === "" || !canSend} onClick={() => handlePrompt()} className="send-button">
            Send
          </button>
        </div>

        <section className="chat-messages">
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <div className="message user-message">
                <div className="text">
                  {message[0]}
                </div>
              </div>
              <div className="message gpt-response">
                <div className="gpt-text">
                  {message[1]}
                </div>
              </div>
            </React.Fragment>
          ))}
        </section>

        <div className="info-button">
          {/* <button className="button" onClick={() => console.log(response)}>
            Print Response to Console
          </button> */}
        </div>
      </div>
    </>
  );
}

export default App;
