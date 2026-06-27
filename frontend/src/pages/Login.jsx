import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("FULL RESPONSE");
    console.log(response);

    console.log("DATA");
    console.log(response.data);

    console.log("TOKENS");
    console.log(response.data.tokens);

    console.log("ACCESS TOKEN");
    console.log(response.data.tokens.access_token);

    localStorage.setItem(
      "access_token",
      response.data.tokens.access_token
    );
localStorage.setItem(
  "refresh_token",
  response.data.tokens.refresh_token
);
    localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

    setMessage("Login Successful ✅");
    navigate("/dashboard");
  } catch (error) {
    console.log("ERROR:");
    console.log(error);

    console.log("ERROR RESPONSE:");
    console.log(error.response);

    setMessage(error.response?.data?.detail || "Login Failed ❌");
  }
};

  return (
    <div>
      <h1>CareerLens AI Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

      <br /><br />

      <p>{message}</p>
    </div>
  );
}