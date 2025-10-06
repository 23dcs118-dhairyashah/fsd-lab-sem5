// src/App.jsx
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const { user, loading } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setSidebarOpen(false); // Close sidebar on mobile when a chat is selected
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  if (loading) {
    return <div className="empty"><div className="pill">Loading...</div></div>;
  }

  return (
    <>
      {!user ? (
        <Auth />
      ) : (
        <div className="app">
          <Sidebar onChatSelect={handleChatSelect} isSidebarOpen={isSidebarOpen} />
          <ChatWindow activeChat={activeChat} onToggleSidebar={toggleSidebar}/>
        </div>
      )}
    </>
  );
}

export default App;
