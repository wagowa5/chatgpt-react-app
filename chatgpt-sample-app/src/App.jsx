import React from 'react'
import { useState } from 'react'
import './App.css'
// import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([[]]);

  const handlePrompt = () => {
    const ws = new WebSocket('wss://YOUR API GATEWAY URL');
    setMessages(prevMessages => [...prevMessages, [prompt]]);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      // WebSocketが接続されたらメッセージを送信
      ws.send(JSON.stringify({ action: "sendmessage", data: prompt }));
    };

    ws.onmessage = (event) => {
      const response = event.data; // 受け取ったチャンク
    
      setMessages(prevMessages => {
        // 最後のメッセージが現在のプロンプトに対応するか確認
        const lastMessageIndex = prevMessages.length - 1;
        if (lastMessageIndex >= 0 && prevMessages[lastMessageIndex][0] === prompt) {
          // 既存のレスポンスに新しいチャンクを追加
          const updatedLastMessage = [
            prevMessages[lastMessageIndex][0],
            (prevMessages[lastMessageIndex][1] || '') + response
          ];
          return [
            ...prevMessages.slice(0, lastMessageIndex),
            updatedLastMessage
          ];
        }
        // } else {
        //   // 新しいプロンプトに対する最初のチャンクの場合
        //   return [...prevMessages, [prompt, response]];
        // }
      });
    
      console.log('WebSocket Message:', response);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      ws.close();
    };

    // if (ws) {
    //   setMessages(prevMessages => [...prevMessages, [prompt]]);
    //   ws.send(JSON.stringify({ action: "sendmessage", data: prompt }));
    // }
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
          <button onClick={() => handlePrompt()} className="send-button">
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
