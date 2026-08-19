import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProfitCheck from "./ProfitCheck";
import Login from "./Login";
import SignUp from "./SignUp";
import AdminApproval from "./AdminApproval";
import Statistics from "./Statistics";
import Analysis from "./Analysis";
import History from "./History";

import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function MainPage() {
  const [page, setPage] = useState("recommend");
  const [stocks, setStocks] = useState([]);
  const [marketMode, setMarketMode] = useState("");
  const [isLogin, setIsLogin] = useState(
    !!localStorage.getItem("token")
  );
  const [role, setRole] = useState(
    localStorage.getItem("role") || ""
  );

  const loadStocks = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/stocks/recommend`
      );

      const data = await response.json();

      setStocks(data.recommendations || []);
      setMarketMode(data.mode || "");
    } catch (error) {
      console.error("주식 데이터 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 상단 메뉴 */}
      <div className="flex justify-between px-10 py-5 border-b border-zinc-800">

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setPage("recommend")}
            className={`px-5 py-2 rounded-xl font-bold ${
              page === "recommend"
                ? "bg-cyan-500 text-black"
                : "bg-zinc-800"
            }`}
          >
            AI 추천
          </button>

          <button
            onClick={() => setPage("analysis")}
            className={`px-5 py-2 rounded-xl font-bold ${
              page === "analysis"
                ? "bg-purple-500 text-black"
                : "bg-zinc-800"
            }`}
          >
            AI 분석
          </button>

          <button
            onClick={() => setPage("history")}
            className={`px-5 py-2 rounded-xl font-bold ${
              page === "history"
                ? "bg-orange-500 text-black"
                : "bg-zinc-800"
            }`}
          >
            추천 이력
          </button>

          <button
            onClick={() => setPage("statistics")}
            className={`px-5 py-2 rounded-xl font-bold ${
              page === "statistics"
                ? "bg-pink-500 text-black"
                : "bg-zinc-800"
            }`}
          >
            통계
          </button>

          <button
            onClick={() => setPage("profit")}
            className={`px-5 py-2 rounded-xl font-bold ${
              page === "profit"
                ? "bg-green-500 text-black"
                : "bg-zinc-800"
            }`}
          >
            수익률 체크
          </button>
        </div>

        <div className="flex gap-3">

          {!isLogin ? (
            <>
              <a
                href="/login"
                className="bg-blue-600 px-4 py-2 rounded-xl"
              >
                로그인
              </a>

              <a
                href="/signup"
                className="bg-green-600 px-4 py-2 rounded-xl"
              >
                회원가입
              </a>
            </>
          ) : (
            <>
              {role === "ADMIN" && (
                <a
                  href="/admin"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-xl"
                >
                  관리자
                </a>
              )}

              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded-xl"
              >
                로그아웃
              </button>
            </>
          )}

        </div>
      </div>

      {page === "recommend" ? (
        <div className="p-10">

          <h1 className="text-5xl font-bold mb-4">
            AI 주식 추천 시스템
          </h1>

          <div className="mb-8 text-zinc-400">
            시장 상태 : {marketMode}
          </div>

          {stocks.length === 0 ? (
            <div className="text-red-400 text-xl">
              추천 종목이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {stocks.map((stock, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">
                      {stock.stockName}
                    </h2>

                    <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                      {stock.signal}
                    </span>
                  </div>

                  <div className="text-zinc-400">
                    AI 점수
                  </div>

                  <div className="text-cyan-400 text-5xl font-bold mb-4">
                    {stock.score}점
                  </div>

                  <div className="text-zinc-400 mb-1">
                    추천 이유
                  </div>

                  <div className="text-lg mb-5">
                    {stock.reason}
                  </div>

                  <hr className="border-zinc-700 mb-5" />

                  <div className="space-y-3">

                    <div className="flex justify-between">
                      <span>RSI</span>
                      <span className="text-yellow-400">
                        {stock.rsi}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>MACD</span>
                      <span className="text-green-400">
                        {stock.macd}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>거래량 증가율</span>
                      <span className="text-green-400">
                        {(stock.volumeRate * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>이동평균선</span>
                      <span className="text-green-400">
                        {stock.maAlignment
                          ? "✅ 정배열"
                          : "❌ 역배열"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>캔들 패턴</span>
                      <span className="text-cyan-400">
                        {stock.candlePattern}
                      </span>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      ) : page === "analysis" ? (
        <Analysis />
      ) : page === "history" ? (
        <History />
      ) : page === "statistics" ? (
        <Statistics />
      ) : (
        <ProfitCheck />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminApproval />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/history" element={<History />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}
