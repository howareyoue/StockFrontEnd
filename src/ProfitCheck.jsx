import { useState } from "react";

function ProfitCheck() {

  const [stockName, setStockName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8081";

  const checkProfit = async () => {

    if (!stockName.trim()) {
      alert("종목명을 입력하세요.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {

      console.log("검색 시작");

      const searchRes = await fetch(
        `${API}/api/profit/search?name=${encodeURIComponent(stockName)}`
      );

      console.log("search status =", searchRes.status);

      if (!searchRes.ok) {
        throw new Error(`종목 검색 실패 (${searchRes.status})`);
      }

      const searchData = await searchRes.json();

      console.log("searchData =", searchData);

      if (!searchData.success) {
        alert(searchData.message || "종목을 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      const profitRes = await fetch(
        `${API}/api/profit/check?code=${searchData.code}`
      );

      console.log("profit status =", profitRes.status);

      if (!profitRes.ok) {
        throw new Error(`수익률 조회 실패 (${profitRes.status})`);
      }

      const profitData = await profitRes.json();

      console.log("profitData =", profitData);

      const finalResult = {
        ...profitData,
        stockName: searchData.stockName
      };

      console.log("finalResult =", finalResult);

      setResult(finalResult);

    } catch (error) {

      console.error("에러 발생", error);

      alert("조회 실패 : " + error.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          수익률 체크
        </h1>

        <p className="text-zinc-400 mb-8">
          시초가 기준 3%, 5% 달성 여부를 확인합니다.
        </p>

        {/* 검색 영역 */}
        <div className="flex gap-3 mb-8">

          <input
            type="text"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && checkProfit()
            }
            placeholder="종목명 입력 (예: 삼성전자)"
            className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-400"
          />

          <button
            onClick={checkProfit}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-600 text-black px-6 py-3 rounded-xl font-bold transition"
          >
            {loading ? "조회 중..." : "조회"}
          </button>

        </div>

        {/* 결과 */}
        {result && result.success && (

          <div
            className={`bg-zinc-900 rounded-2xl p-6 border-2 ${
              result.hit5
                ? "border-green-500"
                : result.hit3
                ? "border-blue-500"
                : result.profitRate > 0
                ? "border-yellow-500"
                : "border-red-500"
            }`}
          >

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {result.stockName}
              </h2>

              <span
                className={`px-4 py-2 rounded-full font-bold text-sm ${
                  result.hit5
                    ? "bg-green-500 text-white"
                    : result.hit3
                    ? "bg-blue-500 text-white"
                    : result.profitRate > 0
                    ? "bg-yellow-500 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                {result.status}
              </span>

            </div>

            <div className="text-center mb-6">

              <p className="text-zinc-400 text-sm mb-1">
                현재 수익률
              </p>

              <p
                className={`text-5xl font-bold ${
                  result.profitRate >= 5
                    ? "text-green-400"
                    : result.profitRate >= 3
                    ? "text-blue-400"
                    : result.profitRate > 0
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {result.profitRate > 0 ? "+" : ""}
                {result.profitRate}%
              </p>

              <p className="text-zinc-400 text-sm mt-2">
                장중 최고 수익률 :
                <span className="text-green-400 font-bold ml-2">
                  +{result.maxProfitRate}%
                </span>
              </p>

            </div>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>시초가</span>
                <span>
                  {result.openPrice?.toLocaleString()}원
                </span>
              </div>

              <div className="flex justify-between">
                <span>현재가</span>
                <span className="text-cyan-400">
                  {result.currentPrice?.toLocaleString()}원
                </span>
              </div>

              <div className="flex justify-between">
                <span>장중 최고가</span>
                <span className="text-green-400">
                  {result.highPrice?.toLocaleString()}원
                </span>
              </div>

              <hr className="border-zinc-700" />

              <div className="flex justify-between">
                <span>3% 목표가</span>
                <span>
                  {Math.round(
                    result.openPrice * 1.03
                  ).toLocaleString()}원
                  {result.hit3 && " ✅"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>5% 목표가</span>
                <span>
                  {Math.round(
                    result.openPrice * 1.05
                  ).toLocaleString()}원
                  {result.hit5 && " ✅"}
                </span>
              </div>

            </div>

          </div>
        )}

        {result && !result.success && (
          <div className="bg-red-900 p-4 rounded-xl mt-4">
            {result.message}
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfitCheck;