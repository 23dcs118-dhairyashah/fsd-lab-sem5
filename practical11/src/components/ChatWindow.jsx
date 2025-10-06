// src/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const ChatWindow = ({ activeChat, onToggleSidebar }) => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }
    const msgsRef = collection(db, 'chats', activeChat.chatId, 'messages');
    const qy = query(msgsRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(qy, (qs) => {
      const msgs = qs.docs.map(d => d.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !activeChat) return;

    setNewMessage('');
    const msgsRef = collection(db, 'chats', activeChat.chatId, 'messages');
    await addDoc(msgsRef, { text, senderId: currentUser.uid, createdAt: serverTimestamp() });

    // Update last message mirrors
    const [uid1, uid2] = activeChat.chatId.split('_');
    const otherUid = currentUser.uid === uid1 ? uid2 : uid1;

    const chatRef = doc(db, 'chats', activeChat.chatId);
    await updateDoc(chatRef, { lastMessage: text, updatedAt: serverTimestamp() });
    await updateDoc(doc(db, 'userChats', currentUser.uid, 'items', activeChat.chatId), { lastMessage: text, updatedAt: serverTimestamp() });
    await updateDoc(doc(db, 'userChats', otherUid, 'items', activeChat.chatId), { lastMessage: text, updatedAt: serverTimestamp() });
  };

  if (!activeChat) {
    return (
        <main className="main">
            <div className="topbar">
                <div className="title">
                    <div className="menu"><button className="btn ghost" onClick={onToggleSidebar}>☰</button></div>
                    <div><strong>Welcome</strong><div className="muted" style={{ fontSize: '.9rem' }}>Select a conversation to start chatting.</div></div>
                </div>
            </div>
            <div className="content">
                <div className="empty"><div className="pill">No chat selected</div></div>
            </div>
        </main>
    );
  }

  return (
    <main className="main">
      <div className="topbar">
        <div className="title">
          <div className="menu"><button className="btn ghost" onClick={onToggleSidebar}>☰</button></div>
          <div><strong>{activeChat.user.name || 'Chat'}</strong><div className="muted" style={{ fontSize: '.9rem' }}>{activeChat.user.email || ''}</div></div>
        </div>
      </div>
      <div className="content">
        <div className="messages" id="messages">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.senderId === currentUser.uid ? 'me' : 'you'}`}>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="composer" onSubmit={handleSendMessage}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
            placeholder="Type a message…"
          />
          <button type="submit" className="btn primary">Send</button>
        </form>
      </div>
    </main>
  );
};

export default ChatWindow;
