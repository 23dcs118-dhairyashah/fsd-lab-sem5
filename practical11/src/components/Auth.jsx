// src/components/Auth.jsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const ensureUserDoc = async (user) => {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        name: user.displayName || 'Anonymous',
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);
      await ensureUserDoc(cred.user);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const displayName = name.trim() || email.split('@')[0];
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, {
          displayName,
          photoURL: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(displayName)}`,
        });
        await ensureUserDoc(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserDoc(cred.user);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="auth card">
      <div className="logo" style={{ marginBottom: '12px' }}>
        <span className="dot"></span> <span>Chatter</span>
      </div>
      <h2>{isSignup ? 'Create account' : 'Welcome back'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <div className="group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
          </div>
        )}
        <div className="group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="ada@chatter.app" />
        </div>
        <div className="group">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
        </div>
        <div className="group">
          <button type="submit" className="btn primary full">
            {isSignup ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </form>
      <div className="group">
        <button className="btn full" onClick={handleGoogleSignIn}>Continue with Google</button>
      </div>
      <div className="switch">
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(!isSignup); }}>
          {isSignup ? 'Sign in' : 'Create one'}
        </a>
      </div>
       <p className="muted" style={{ marginTop: '8px' }}>Fill your Firebase config in <code>src/firebase.js</code> to run locally.</p>
    </div>
  );
};

export default Auth;
