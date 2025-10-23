import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./AuthPage.scss";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  const handleAuth = async () => {
    try {
      setError(null);
      let userCredential;
      if (isLogin) {
        // 🔹 вход
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 🔹 регистрация
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      
      setUser(userCredential.user);
      console.log("✅ Успешный вход:", userCredential.user);
      
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      console.log("✅ Google вход:", result.user);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  
  return (
    <div className="auth-wrapper">
      {user ? (
        <div className="auth-card">
          <h2>👋 Добро пожаловать, {user.displayName || user.email}</h2>
          {user.photoURL && <img src={user.photoURL} alt="User avatar" className="avatar" />}
          <button className="btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      ) : (
        <div className="auth-card">
          <h1 className="auth-title">🍕 Pizza Online Shop</h1>
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
