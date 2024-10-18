import { useState } from "react";
import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [email, setEmail] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showPrompt, setShowPrompt] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;
  const handlePromptRequest = async () => {
    try {
      const response = await axios.post(`${baseUrl}api/generate`, {
        prompt,
      });
      setShowPrompt(response.data.message);
    } catch (error) {
      console.error("Error generating prompt:", error);
    }
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(`${baseUrl}api/send-email`, {
        email,
        prompt: showPrompt,
      });
      toast.success("Email sent successfully!", {
        className: "toast-success",
      });
    } catch (error) {
      toast.error(
        "Error sending email. Please check the email address and try again!",
        {
          className: "toast-error",
        }
      );
    }
  };

  return (
    <div className="app-container">
      <h1>Prompt Generator</h1>
      <div className="input-container">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="button-container">
        <button onClick={handlePromptRequest} className="btn">
          Generate Prompt
        </button>
        <button onClick={handleSendEmail} className="btn">
          Send Email
        </button>
      </div>
      {showPrompt && (
        <div className="prompt-response">
          <h2>Generated Prompt:</h2>
          <p>{showPrompt}</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
