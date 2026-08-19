import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Analysis() {

  const [stocks, setStocks] = useState([]);
  const [aiAnalysisMap, setAiAnalysisMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {

    setLoading(true);
    setError(null);

    try {

      const response = await fetch(
        `${API_URL}/api/stocks/recommend`
      );

      const data = await response.json();

      setStocks(data.recommendations || []);

    } catch (e) {

      console.error(e);
      setError("추천 종목을 불러오는 중 오류가 발생했습니다.");

    } finally {

      setLoading(false);

    }

  };

  // "AI 분석" 버튼 클릭 시 호출 - 20종목 뉴스 종합 분석
  const loadAiAnalysis = async () => {

    setAiLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/api/ai-analysis`
      );

      const data = await response.json();

      const map = {};
      (data || []).forEach((item) => {
        map[item.stockCode] = item;
      });

      setAiAnalysisMap(map);

    } catch (e) {

      console.error(e);

    } finally {

      setAiLoading(false);

    }

  };

  const getSignalColor = (signal) => {

    switch (signal) {

      case "STRONG BUY":
        return "bg-red-500";

      case "BUY":
        return "bg-green-500";

      case "HOLD":
        return "bg-yellow-500";

      case "SELL":
        return "bg-gray-500";

      default:
        return "bg-zinc-700";
    }

  };

  const getScoreColor = (score) => {

    if (score >= 80)
      return "text-red-400";

    if (score >= 70)
      return "text-green-400";

    if (score >= 60)
      return "text-cyan-400";

    return "text-white";

  };

  if (loading) {
    return (
      <div className="p-10">
        <h1 className="text-5xl font-bold mb-10">AI 분석</h1>
        <div className="text-zinc-400">분석 데이터 로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-5xl font-bold mb-10">AI 분석</h1>
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (

    <div className="p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold">

          AI 종목 분석

        </h1>

        <button
          onClick={loadAiAnalysis}
          disabled={aiLoading}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-6 py-3 rounded-full font-bold"
        >
          {aiLoading ? "뉴스 분석 중..." : "AI 뉴스 분석 실행"}
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {

          stocks.map((stock, index)=>{

            const aiResult = aiAnalysisMap[stock.stockCode];

            return (
            <div
              key={index}
              className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-3xl font-bold">

                    {stock.stockName}

                  </h2>

                  <div className="text-zinc-400">

                    {stock.stockCode}

                  </div>

                </div>

                <span
                  className={`${getSignalColor(stock.signal)} px-4 py-2 rounded-full font-bold`}
                >

                  {stock.signal}

                </span>

              </div>

              <div className="mt-6">

                <div className="text-zinc-400">

                  AI 점수

                </div>

                <div
                  className={`text-6xl font-bold ${getScoreColor(stock.score)}`}
                >

                  {stock.score}

                </div>

              </div>

              <hr className="my-5 border-zinc-700"/>

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

                  <span>Signal</span>

                  <span className="text-cyan-400">

                    {stock.macdSignal}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>거래량 증가율</span>

                  <span className="text-green-400">

                    {(stock.volumeRate * 100).toFixed(0)}%

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>이평선</span>

                  <span>

                    {

                      stock.maAlignment

                      ?

                      "✅ 정배열"

                      :

                      "❌ 역배열"

                    }

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>골든크로스</span>

                  <span>

                    {

                      stock.goldenCross

                      ?

                      "✅"

                      :

                      "❌"

                    }

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>캔들패턴</span>

                  <span className="text-cyan-400">

                    {stock.candlePattern}

                  </span>

                </div>

              </div>

              <hr className="my-5 border-zinc-700"/>

              <div>

                <div className="text-zinc-400 mb-2">

                  기술적 분석 근거

                </div>

                <div className="text-lg">

                  {stock.reason}

                </div>

              </div>

              {

                aiResult && (

                  <>

                    <hr className="my-5 border-zinc-700"/>

                    <div>

                      <div className="text-zinc-400 mb-2 flex items-center gap-2">

                        <span>AI 뉴스 분석</span>

                        <span className="text-xs bg-cyan-900 text-cyan-300 px-2 py-1 rounded-full">

                          {aiResult.aiAction}

                        </span>

                      </div>

                      <div className="text-lg mb-3">

                        {aiResult.aiReason}

                      </div>

                      {

                        aiResult.newsSummary && (

                          <div className="text-sm text-zinc-500">

                            참고 뉴스: {aiResult.newsSummary}

                          </div>

                        )

                      }

                    </div>

                  </>

                )

              }

            </div>
            );

          })

        }

      </div>

    </div>

  );

}