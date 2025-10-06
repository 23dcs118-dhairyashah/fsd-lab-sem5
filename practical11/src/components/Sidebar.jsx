// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { signOut, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot, orderBy, doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../hooks/useAuth.jsx'; // Renamed as requested
import { timeAgo, escapeHtml, debounce } from '../utils';

const Sidebar = ({ onChatSelect, isSidebarOpen }) => {
  const { user } = useAuth();
  
  // States for views and data
  const [activeView, setActiveView] = useState('chats'); // 'chats', 'people', 'profile'
  const [recentChats, setRecentChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  // States for profile editing
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [profilePhotoURL, setProfilePhotoURL] = useState(user?.photoURL || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);


  // --- DATA FETCHING EFFECTS ---

  // Effect to load recent chats (only for 'chats' view)
  useEffect(() => {
    if (!user || activeView !== 'chats') return;
    const ucRef = collection(db, 'userChats', user.uid, 'items');
    const qy = query(ucRef, orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(qy, (qs) => {
      const chats = qs.docs.map(doc => doc.data());
      setRecentChats(chats);
    });
    return () => unsubscribe();
  }, [user, activeView]);

  // Effect to load all users (only for 'people' view)
  useEffect(() => {
    if (activeView !== 'people' || !user) return;
    
    const fetchUsers = async () => {
        const usersRef = collection(db, 'users');
        // Query all users except the current one, ordered by name
        const q = query(usersRef, where('uid', '!=', user.uid), orderBy('name'));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map(doc => doc.data());
        setAllUsers(usersList);
    };

    fetchUsers().catch(console.error);
  }, [activeView, user]);

  // Effect to reset profile form when user changes
  useEffect(() => {
    if (user) {
        setProfileName(user.displayName || '');
        setProfilePhotoURL(user.photoURL || '');
    }
  }, [user]);


  // --- EVENT HANDLERS ---

  // Handle user search
  const handleSearch = async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }
    const usersRef = collection(db, 'users');
    const qs = await getDocs(usersRef);
    const results = qs.docs
      .map(d => d.data())
      .filter(u =>
        u.uid !== user.uid &&
        (u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term))
      );
    setSearchResults(results);
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    debouncedSearch(term);
  };
  
  const composeChatId = (a, b) => (a < b ? `${a}_${b}` : `${b}_${a}`);

  const startChatWith = async (otherUser) => {
    if (!user || user.uid === otherUser.uid) return;
    
    const chatId = composeChatId(user.uid, otherUser.uid);
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, { chatId, participants: [user.uid, otherUser.uid], createdAt: serverTimestamp(), updatedAt: serverTimestamp(), lastMessage: '' });
    }

    const meUserSnap = await getDoc(doc(db, 'users', user.uid));
    const meUserData = meUserSnap.data();

    await setDoc(doc(db, 'userChats', user.uid, 'items', chatId), { chatId, otherUid: otherUser.uid, otherName: otherUser.name || 'User', otherPhoto: otherUser.photoURL || '', lastMessage: '', updatedAt: serverTimestamp() }, { merge: true });
    await setDoc(doc(db, 'userChats', otherUser.uid, 'items', chatId), { chatId, otherUid: user.uid, otherName: meUserData?.name || 'User', otherPhoto: meUserData?.photoURL || '', lastMessage: '', updatedAt: serverTimestamp() }, { merge: true });

    setActiveView('chats'); // Switch back to chats view
    setSearchTerm('');
    setSearchResults([]);
    onChatSelect({ chatId, user: { uid: otherUser.uid, name: otherUser.name, photo: otherUser.photoURL } });
  };
  
  // Handle profile update submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user || !isEditingProfile) return;

    try {
        await updateProfile(auth.currentUser, { displayName: profileName, photoURL: profilePhotoURL });
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { name: profileName, photoURL: profilePhotoURL });
        alert('Profile updated successfully!');
        setIsEditingProfile(false);
    } catch (error) {
        console.error("Error updating profile: ", error);
        alert(`Failed to update profile: ${error.message}`);
    }
  };


  // --- RENDER FUNCTIONS ---

  const renderUserRow = (u, context = 'search') => (
      <div className="chat-row" key={`${context}-${u.uid}`} onClick={() => startChatWith(u)}>
          <img src={u.photoURL || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(u.name || u.uid)}`} alt="pfp" />
          <div>
              <div className="name">{escapeHtml(u.name || 'User')}</div>
              <div className="last">{escapeHtml(u.email || '')}</div>
          </div>
          <button className="btn" style={{ marginLeft: 'auto' }}>Chat</button>
      </div>
  );

  const renderContent = () => {
    switch(activeView) {
        case 'people':
            return (
                <div className="chats">
                    {allUsers.length > 0 ? allUsers.map(u => renderUserRow(u, 'people')) : <div className="muted" style={{textAlign: 'center', padding: '10px'}}>No other users found</div>}
                </div>
            );
        case 'profile':
            return (
                <div style={{padding: '12px'}}>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="group">
                           <label>Display Name</label>
                           <input value={profileName} onChange={e => setProfileName(e.target.value)} disabled={!isEditingProfile} />
                        </div>
                         <div className="group">
                           <label>Photo URL</label>
                           <input value={profilePhotoURL} onChange={e => setProfilePhotoURL(e.target.value)} disabled={!isEditingProfile} />
                        </div>
                        {!isEditingProfile ? (
                            <button type="button" className="btn full" onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
                        ) : (
                            <div style={{display: 'flex', gap: '8px'}}>
                                <button type="button" className="btn ghost full" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                                <button type="submit" className="btn primary full">Save Changes</button>
                            </div>
                        )}
                    </form>
                </div>
            );
        case 'chats':
        default:
             return (
                <>
                    <div className="card search">
                        <input value={searchTerm} onChange={handleSearchChange} placeholder="Search users by name/email" />
                        <button className="btn" onClick={() => { location.href = `mailto:?subject=Join me on Chatter&body=Let’s chat here: ${location.href}`; }}>+</button>
                    </div>
                    <div className="muted" style={{ padding: '8px 8px 0' }}>{searchTerm ? 'Search Results' : 'Recent chats'}</div>
                    <div className="chats">
                        {searchTerm ? (
                            searchResults.length > 0 ? searchResults.map(u => renderUserRow(u, 'search')) : <div className="muted" style={{textAlign: 'center', padding: '10px'}}>No users found</div>
                        ) : (
                            recentChats.map(c => (
                                <div className="chat-row" key={c.chatId} onClick={() => onChatSelect({ chatId: c.chatId, user: { uid: c.otherUid, name: c.otherName, photo: c.otherPhoto } })}>
                                    <img src={c.otherPhoto || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(c.otherUid)}`} alt="pfp" />
                                    <div>
                                        <div className="name">{escapeHtml(c.otherName || 'User')}</div>
                                        <div className="last">{escapeHtml(c.lastMessage || 'Say hi 👋')}</div>
                                    </div>
                                    <div className="muted">{timeAgo(c.updatedAt?.toDate?.())}</div>
                                </div>
                            ))
                        )}
                    </div>
                </>
             );
    }
  };


  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
      <div className="logo"><span className="dot"></span><span>Chatter</span></div>
      
      <div className="card user-card">
        <img src={user?.photoURL || `https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.uid}`} alt="me" />
        <div>
          <div style={{ fontWeight: 600 }}>{user?.displayName || 'Anonymous'}</div>
          <div className="muted">{user?.email || ''}</div>
        </div>
      </div>
      
      <div className="nav card">
        <div className={`item ${activeView === 'chats' ? 'active' : ''}`} onClick={() => setActiveView('chats')}>💬 Chats</div>
        <div className={`item ${activeView === 'people' ? 'active' : ''}`} onClick={() => setActiveView('people')}>👥 People</div>
        <div className={`item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>🙍 Profile</div>
        <div className="item" onClick={() => signOut(auth)}>🚪 Logout</div>
      </div>

      <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </div>
      
      <div className="muted" style={{ padding: '8px', textAlign: 'center' }}>Built with Firebase & React</div>
    </aside>
  );
};

export default Sidebar;
