import React, { useState } from "react";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Login: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      console.log("✅ Успешный вход:", result.user);
    } catch (error) {
      console.error("❌ Ошибка входа:", error);
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {user ? (
        <>
          <h2>Добро пожаловать, {user.displayName}</h2>
          <img
            src={user.photoURL || ""}
            alt="User avatar"
            width={100}
            style={{ borderRadius: "50%" }}
          />
          <p>{user.email}</p>
          <button onClick={handleLogout}>Выйти</button>
        </>
      ) : (
        <>
          <h2>Вход через Google</h2>
          <button onClick={signInWithGoogle}>Войти с Google</button>
        </>
      )}
    </div>
  );
};

export default Login;
