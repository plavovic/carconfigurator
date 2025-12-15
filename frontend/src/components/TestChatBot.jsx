import { useState } from "react";
import { sendMessage } from "../api/chatbot"; // adjust path

export default function TestChatBot() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const send = async () => {
    setError("");
    try {
      const data = await sendMessage(text);
      setReply(data.reply);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={send}>Send</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {reply && <p><b>Bot:</b> {reply}</p>}
    </div>
  );
}
