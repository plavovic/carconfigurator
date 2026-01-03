import React, { useEffect, useRef, useState } from "react";
import { http } from "../api/http";
import "./ChatBotWidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);

  // On open: show greeting once per “session”
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "bot", text: "Hello, how can I help you?" }]);
    }
  }, [open, messages.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      // If you use CRA dev server proxy, just "/api/chatbot"
      // Otherwise use "http://localhost:3000/api/chatbot" (your backend port)
      const data = await http.post("/api/chatbot", { message: text });

      const replyText = data?.reply ?? "(No reply)";
      setMessages((m) => [...m, { role: "bot", text: replyText }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Sorry — I couldn’t reach the server." },
      ]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="cw-root">
      {open && (
        <div className="cw-panel" role="dialog" aria-label="Chat">
          <div className="cw-header">
            <div className="cw-title">Car Configurator Assistant</div>
            <button className="cw-iconBtn" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>

          <div className="cw-messages" ref={listRef}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`cw-row ${m.role === "user" ? "cw-row-user" : "cw-row-bot"}`}
              >
                <div className={`cw-bubble ${m.role === "user" ? "cw-user" : "cw-bot"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="cw-row cw-row-bot">
                <div className="cw-bubble cw-bot">Typing…</div>
              </div>
            )}
          </div>

          <div className="cw-inputBar">
            <textarea
              className="cw-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message…"
              rows={1}
            />
            <button className="cw-send" onClick={send} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}

      <button className="cw-fab" onClick={() => setOpen((v) => !v)} aria-label="Open chat">
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
