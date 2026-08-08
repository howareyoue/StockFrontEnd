import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignUp() {

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: ""
  });

  const signup = async () => {

    try {

      await axios.post(
        "http://localhost:8081/api/auth/signup",
        form
      );

      alert(
        "회원가입 완료\n관리자 승인 후 로그인 가능합니다."
      );

      window.location.href = "/login";

    } catch (err) {

      alert(
        err?.response?.data ||
        "회원가입 실패"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">

      <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-700 w-[500px]">

        <h1 className="text-white text-4xl font-bold mb-8 text-center">
          회원가입
        </h1>

        <input
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white"
          placeholder="아이디"
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value
            })
          }
        />

        <input
          type="password"
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white"
          placeholder="비밀번호"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <input
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white"
          placeholder="이름"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <input
          className="w-full p-3 mb-6 rounded-xl bg-zinc-800 text-white"
          placeholder="이메일"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <button
          onClick={signup}
          className="w-full bg-green-500 text-black p-3 rounded-xl font-bold"
        >
          회원가입
        </button>

        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-cyan-400"
          >
            로그인으로 이동
          </Link>
        </div>

      </div>

    </div>
  );
}