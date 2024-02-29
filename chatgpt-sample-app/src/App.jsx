import React from 'react'
import { useState, useEffect } from 'react'
import './App.css'
// import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([[]]);
  const [canSend, setCanSend] = useState(true);

  // websocket接続状態を保持するstate、1つでもtrueのときSendボタンを無効化する
  const [, setWsConnect] = useState([]);

  const [ws, setWs] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // 定期的にWebSocket接続状態をfalseに更新
      setWsConnect(prevWsConnect => {
        let newWsConnect = [false, ...prevWsConnect.slice(0, 9)]; // 最初の10要素だけを保持、先頭にfalseを追加
        // WebSocket接続がすべてfalseのときSendボタンを有効化
        const allFalse = newWsConnect.every(connect => connect === false);
        setCanSend(allFalse);
        return newWsConnect;
      });
    }, 150); // 150ミリ秒ごとに実行
  
    return () => {
      clearInterval(intervalId); // コンポーネントのアンマウント時にクリア
    };
  }, []); // 空の依存配列で一度だけ実行

  useEffect(() => {
    // WebSocket接続を開始
    const ws = new WebSocket('wss://zmzdbywisc.execute-api.ap-northeast-1.amazonaws.com/chat_stream/');
    setWs(ws);

    ws.onopen = () => console.log('WebSocket Connected');
    ws.onclose = () => console.log('WebSocket Disconnected');
    ws.onmessage = (event) => {
      // メッセージ受信時にWebSocket接続状態をtrueに更新
      setWsConnect(prevWsConnect => {
        prevWsConnect.unshift(true);
        return [...prevWsConnect];
      });

      const response = event.data; // 受け取ったチャンク
      setMessages(prevMessages => {
        // 最後のメッセージが現在のプロンプトに対応するか確認
        const lastMessageIndex = prevMessages.length - 1;
        // 既存のレスポンスに新しいチャンクを追加
        const updatedLastMessage = [
          prevMessages[lastMessageIndex][0],
          (prevMessages[lastMessageIndex][1] || '') + response
        ];
        return [
          ...prevMessages.slice(0, lastMessageIndex),
          updatedLastMessage
        ];
      });
      console.log('WebSocket Message:', response);
    };
    ws.onerror = (error) => console.error('WebSocket Error:', error);

    // コンポーネントのアンマウント時にWebSocketをクローズ
    return () => ws.close();
  }, []); // 空の依存配列で一度だけ実行

  const handlePrompt = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // メッセージ送信時にWebSocket接続状態をtrueに更新
      setWsConnect(prevWsConnect => {
        prevWsConnect.unshift(true);
        return [...prevWsConnect];
      });
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
