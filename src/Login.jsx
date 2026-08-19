import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          username,
          password
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("로그인 성공");

      window.location.href = "/";

    } catch (err) {

      alert(
        err?.response?.data ||
        "로그인 실패"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">

      <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-700 w-[450px]">

        <h1 className="text-white text-4xl font-bold mb-8 text-center">
          Stock AI
        </h1>

        <input
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-6 rounded-xl bg-zinc-800 text-white"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-cyan-500 text-black p-3 rounded-xl font-bold"
        >
          로그인
        </button>

        <div className="text-center mt-5">
          <Link
            to="/signup"
            className="text-cyan-400"
          >
            회원가입
          </Link>
        </div>

      </div>

    </div>
  );
}