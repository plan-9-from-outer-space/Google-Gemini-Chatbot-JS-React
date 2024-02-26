import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    'Who won the latest Nobel Peace Prize for Economics?',
    'How do you make a pizza?',
    'Who is the president of the Ukraine?'
  ];

  function surprise () {
    const numOptions = surpriseOptions.length;
    const randomValue = surpriseOptions[Math.floor(Math.random() * numOptions)];
    setValue(randomValue);
  }

  async function getResponse () {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ history: chatHistory, message: value }),
        headers: { 'Content-Type': 'application/json'}
      };
      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      console.log(data);
      setChatHistory(oldChatHistory => [ ...oldChatHistory, 
          { role: 'user', parts: value }, 
          { role: 'model', parts: data } ]);
      setValue("");
    } catch (error) {
        console.error(error);
        setError("Something went wrong! Please try again later.");
    }
  }

function clear () {
  setValue("");
  setError("");
  setChatHistory([]);
}

  return (
    <div className="app">
      <p>
        What do you want to know?
        {/* <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button> */}
        <button className="surprise" onClick={surprise}>Surprise me</button>
      </p>
      <div className="input-container">
        <input value={value} 
               placeholder="When is Christmas?" 
               onChange={(e) => setValue(e.target.value)} />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
          {chatHistory.map( (chatItem, _index) => 
              <div key={_index}>
                <p className="answer">{chatItem.role} : {chatItem.parts}</p>
              </div>
          )}
      </div>
    </div>
  );
}

export default App;
