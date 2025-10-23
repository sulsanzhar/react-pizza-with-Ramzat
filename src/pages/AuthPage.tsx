import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "./AuthPage.scss";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleAuth = async () => {
    try {
      setError(null);
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  
  return (
    <div className="auth-container">
      {user ? (
        <div className="auth-card">
          <h2>👋 Добро пожаловать, {user.displayName || user.email}</h2>
          {user.photoURL && (
            <img src={user.photoURL} alt="User avatar" className="avatar" />
          )}
          <button className="btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      ) : (
        <div className="auth-card">
          <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          
          {error && <p className="error">{error}</p>}
          
          <button className="btn" onClick={handleAuth}>
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
          
          <div className="divider">или</div>
          
          <button className="btn google-btn" onClick={handleGoogle}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              width={20}
              style={{ marginRight: "8px" }}
            />
            Войти с Google
          </button>
          
          <p className="switch">
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;
