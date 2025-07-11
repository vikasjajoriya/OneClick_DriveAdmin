import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const authCookie = cookies.find((c) => c.startsWith("auth="));
    const loggedIn = authCookie?.split("=")[1] === "true";
    setIsAuthenticated(loggedIn);

    const nameCookie = cookies.find((c) => c.startsWith("userName="));
    const emailCookie = cookies.find((c) => c.startsWith("userEmail="));
    if (nameCookie && emailCookie) {
      setUser({
        name: decodeURIComponent(nameCookie.split("=")[1]),
        email: decodeURIComponent(emailCookie.split("=")[1]),
      });
    } else {
      setUser(null);
    }
  }, []);

  // Handle login
  const login = ({ username, password }) => {
    if (username === "admin" && password === "admin123") {
      document.cookie = "auth=true; path=/; max-age=86400"; // 1 day
      document.cookie = "userName=" + encodeURIComponent("Lamoyi Sims") + "; path=/; max-age=86400";
      document.cookie = "userEmail=" + encodeURIComponent("lamoyi2380@fenexy.com") + "; path=/; max-age=86400";
      setIsAuthenticated(true);
      setUser({
        name: "Lamoyi Sims",
        email: "lamoyi2380@fenexy.com",
      });
      router.push("/dashboard");
    } else {
      showMessage("Invalid username or password");
    }
  };

  // Handle logout
  const logout = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userName=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, message, showMessage, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);