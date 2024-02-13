import { useState } from 'react'
import './App.css'
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [question, setQuestion] = useState([]);
//  const [responses, setResponses] = useState([]);
  const [response, setResponse] = useState([]);
  const API_KEY = "YOUR API KEY";

  // const [isStreamVisible, setIsStreamVisible] = useState(false);

  const handlePrompt = async () => {
      setQuestion(prompt);
      
    try {
      setResponse("Loading");
      setQuestion(prompt);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setResponse(response.data.choices[0].message.content);
      setPrompt("");
    } catch (error) {
      setResponse(`Error ChatGPT: ${error}`);
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
          <button onClick={() => handlePrompt()} className="send-button">
            Send
          </button>
        </div>

        <section className="chat-messages">

          <div className="message user-message">
            <div className="text">
              {question}
            </div>
          </div>

          {/*if ({isStreamVisible}) {
            <ChatStream prompt={prompt} />
          }*/}

          <div className="message gpt-response">
            <div className="text">
              {response}
            </div>
          </div>

        </section>

        <div className="info-button">
          <button className="button" onClick={() => console.log(response)}>
            Print Response to Console
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
