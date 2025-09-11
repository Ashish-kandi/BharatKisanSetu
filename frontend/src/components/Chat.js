// src/components/Chat.js
import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

function Chat({ chatId, currentUser }) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt"));
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      }
    });
    setNewMessage("");
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <span>Chat</span>
      </div>
      <div style={styles.messages}>
        {messages &&
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.message,
                alignSelf: msg.user.id === currentUser.id ? "flex-end" : "flex-start",
                background: msg.user.id === currentUser.id ? "#DCF8C6" : "#FFF"
              }}
            >
              <img
                src={msg.user.avatar}
                alt={msg.user.name}
                style={styles.avatar}
              />
              <div>
                <div style={styles.userName}>{msg.user.name}</div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={styles.inputForm}>
        <input
          style={styles.input}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={styles.sendBtn} type="submit">Send</button>
      </form>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: 350,
    height: 500,
    border: "1px solid #ddd",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    background: "#f7f7f7"
  },
  header: {
    padding: 12,
    borderBottom: "1px solid #eee",
    fontWeight: "bold"
  },
  messages: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  message: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    maxWidth: "70%"
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%"
  },
  userName: {
    fontSize: 12,
    color: "#888"
  },
  inputForm: {
    display: "flex",
    borderTop: "1px solid #eee",
    padding: 8,
    gap: 8
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc"
  },
  sendBtn: {
    padding: "8px 16px",
    background: "#25d366",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  }
};

export default Chat;
