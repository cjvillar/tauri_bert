import React, { useState } from "react";
import * as qna from "@tensorflow-models/qna";
import * as tf from "@tensorflow/tfjs"; //needed
import { SwishSpinner } from "react-spinners-kit";
import "./styles.css";

const QnAComponent = () => {
  const [question, setQuestion] = useState("");
  const [passage, setPassage] = useState("");
  const [answer, setAnswer] = useState("");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // load Q&A model
  const loadModel = async () => {
    setIsLoading(true);
    const loadedModel = await qna.load();
    setModelLoaded(true);
    setIsLoading(false);
    return loadedModel;
  };

  // Q&A func
  const handleQuestionSubmit = async () => {
    if (!passage.trim()) {
      alert("Please provide a passage.");
      return;
    }

    const loadedModel = await loadModel();
    setIsLoading(true);
    const answers = await loadedModel.findAnswers(question, passage);

    if (answers && answers.length > 0) {
      setAnswer(answers[0].text); // extract 'text' prop from answer obj
    } else {
      setAnswer("Sorry, I couldn't find an answer to that question.");
    }
    setIsLoading(false);
  };

  // file drop func
  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setPassage(event.target.result);
    };
    reader.readAsText(file);
  };

  // handle txt input change
  const handlePassageChange = (e) => {
    setPassage(e.target.value);
  };

  return (
    <div>
      <h2>Question and Answer</h2>
      <div>
        <textarea
          className="textarea"
          placeholder="Enter the passage here..."
          value={passage}
          onChange={handlePassageChange}
        />
        <div
          className="drop-box"
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          Drop a text file here or type/paste the passage above.
        </div>
      </div>
      {isLoading && (
        <div className="spinner">
          <SwishSpinner size={40} color="#00ff89" />
        </div>
      )}
      {!isLoading && (
        <div className="qna-container">
          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleQuestionSubmit}>Ask</button>
        </div>
      )}
      {!isLoading && answer && (
        <div className="qna-container">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default QnAComponent;
