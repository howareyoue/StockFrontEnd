import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function Statistics() {

  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    fail: 0,
    wait: 0,
    successRate: 0,
    averageProfit: 0,
    averageMaxProfit: 0,
    hit3Rate: 0,
    hit5Rate: 0
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {

    loadStatistics();
    loadHistory();

  }, []);

  const loadStatistics = async () => {

    try {

      const res = await fetch(
        "http://localhost:8081/api/history/statistics"
      );

      const data = await res.json();

      setStats(data);

    } catch (e) {

      console.log(e);

    }

  };

  const loadHistory = async () => {

    try {

      const res = await fetch(
        "http://localhost:8081/api/history"
      );

      const data = await res.json();

      setHistory(data);

    } catch (e) {

      console.log(e);

    }

  };

  return (

    <div className="p-10">

      <h1 className="text-5xl font-bold mb-10">
        AI 추천 통계
      </h1>

      {/* 카드 */}

      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-zinc-900 rounded-3xl p-6">

          <div className="text-zinc-400">

            총 추천

          </div>

          <div className="text-5xl font-bold text-cyan-400">

            {stats.total}

          </div>

        </div>

        <div className="bg-zinc-900 rounded-3xl p-6">

          <div className="text-zinc-400">

            성공률

          </div>

          <div className="text-5xl font-bold text-green-400">

            {stats.successRate}%

          </div>

        </div>

        <div className="bg-zinc-900 rounded-3xl p-6">

          <div className="text-zinc-400">

            평균수익률

          </div>

          <div className="text-5xl font-bold text-yellow-400">

            {stats.averageProfit}%

          </div>

        </div>

        <div className="bg-zinc-900 rounded-3xl p-6">

          <div className="text-zinc-400">

            평균 최고수익률

          </div>

          <div className="text-5xl font-bold text-red-400">

            {stats.averageMaxProfit}%

          </div>

        </div>

      </div>

      {/* 달성률 */}

      <div className="grid grid-cols-2 gap-6 mb-10">

        <div className="bg-zinc-900 rounded-3xl p-6">

          <div className="text-2xl mb-4">

            3% 달성률

          </div>

          <div className="w-full bg-zinc-700 rounded-full h-8">

            <div

              className="bg-green-500 h-8 rounded-full"

              style={{

                width: `${stats.hit3Rate}%`

              }}

            />

          </div>

          <div className="mt-3 text-3xl">

            {stats.hit3Rate}%

          </div>

        </div>

        <div className="bg-zinc-900 rounded-3xl p-6">

          <div className="text-2xl mb-4">

            5% 달성률

          </div>

          <div className="w-full bg-zinc-700 rounded-full h-8">

            <div

              className="bg-cyan-500 h-8 rounded-full"

              style={{

                width: `${stats.hit5Rate}%`

              }}

            />

          </div>

          <div className="mt-3 text-3xl">

            {stats.hit5Rate}%

          </div>

        </div>

      </div>

      {/* 차트 */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        {/* Pie Chart - 성공/실패/진행중 비율 */}

        <div className="bg-zinc-900 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">

            추천 상태 비율

          </h2>

          <Pie

            data={{

              labels: ["성공", "실패", "진행중"],

              datasets: [

                {

                  data: [stats.success, stats.fail, stats.wait],

                  backgroundColor: [

                    "rgba(34, 197, 94, 0.8)",

                    "rgba(239, 68, 68, 0.8)",

                    "rgba(234, 179, 8, 0.8)",

                  ],

                  borderColor: [

                    "rgb(34, 197, 94)",

                    "rgb(239, 68, 68)",

                    "rgb(234, 179, 8)",

                  ],

                  borderWidth: 2,

                },

              ],

            }}

            options={{

              responsive: true,

              maintainAspectRatio: true,

              plugins: {

                legend: {

                  position: "bottom",

                  labels: {

                    color: "rgb(212, 212, 212)",

                    font: {

                      size: 12,

                    },

                  },

                },

              },

            }}

          />

        </div>

        {/* Bar Chart - 평균수익률과 평균최고수익률 비교 */}

        <div className="bg-zinc-900 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">

            수익률 비교

          </h2>

          <Bar

            data={{

              labels: ["평균수익률", "평균최고수익률"],

              datasets: [

                {

                  label: "수익률 (%)",

                  data: [stats.averageProfit, stats.averageMaxProfit],

                  backgroundColor: [

                    "rgba(234, 179, 8, 0.8)",

                    "rgba(239, 68, 68, 0.8)",

                  ],

                  borderColor: [

                    "rgb(234, 179, 8)",

                    "rgb(239, 68, 68)",

                  ],

                  borderWidth: 2,

                },

              ],

            }}

            options={{

              responsive: true,

              maintainAspectRatio: true,

              indexAxis: "y",

              plugins: {

                legend: {

                  labels: {

                    color: "rgb(212, 212, 212)",

                  },

                },

              },

              scales: {

                x: {

                  ticks: {

                    color: "rgb(212, 212, 212)",

                  },

                  grid: {

                    color: "rgba(113, 113, 122, 0.3)",

                  },

                },

                y: {

                  ticks: {

                    color: "rgb(212, 212, 212)",

                  },

                  grid: {

                    color: "rgba(113, 113, 122, 0.3)",

                  },

                },

              },

            }}

          />

        </div>

        {/* Line Chart - 종목별 최고수익률 */}

        <div className="bg-zinc-900 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">

            종목별 최고수익률

          </h2>

          <Line

            data={{

              labels: history.slice(0, 10).map((item) => item.stockName),

              datasets: [

                {

                  label: "최고수익률 (%)",

                  data: history.slice(0, 10).map((item) => item.maxProfitRate),

                  borderColor: "rgb(34, 197, 94)",

                  backgroundColor: "rgba(34, 197, 94, 0.1)",

                  borderWidth: 2,

                  fill: true,

                  tension: 0.3,

                  pointBackgroundColor: "rgb(34, 197, 94)",

                  pointBorderColor: "rgb(34, 197, 94)",

                  pointRadius: 5,

                  pointHoverRadius: 7,

                },

              ],

            }}

            options={{

              responsive: true,

              maintainAspectRatio: true,

              plugins: {

                legend: {

                  labels: {

                    color: "rgb(212, 212, 212)",

                  },

                },

              },

              scales: {

                x: {

                  ticks: {

                    color: "rgb(212, 212, 212)",

                    maxRotation: 45,

                    minRotation: 0,

                  },

                  grid: {

                    color: "rgba(113, 113, 122, 0.3)",

                  },

                },

                y: {

                  ticks: {

                    color: "rgb(212, 212, 212)",

                  },

                  grid: {

                    color: "rgba(113, 113, 122, 0.3)",

                  },

                },

              },

            }}

          />

        </div>

      </div>

      {/* 추천 이력 */}

      <div className="bg-zinc-900 rounded-3xl p-6">

        <h2 className="text-3xl font-bold mb-6">

          최근 추천 결과

        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-zinc-700">

              <th className="py-3">종목</th>

              <th>추천가</th>

              <th>현재가</th>

              <th>최고가</th>

              <th>현재수익률</th>

              <th>최고수익률</th>

              <th>상태</th>

            </tr>

          </thead>

          <tbody>

            {

              history.map((item)=> (

                <tr
                  key={item.id}
                  className="border-b border-zinc-800 text-center"
                >

                  <td className="py-4">

                    {item.stockName}

                  </td>

                  <td>

                    {item.recommendPrice}

                  </td>

                  <td>

                    {item.currentPrice}

                  </td>

                  <td>

                    {item.highPrice}

                  </td>

                  <td>

                    {item.profitRate}%

                  </td>

                  <td>

                    {item.maxProfitRate}%

                  </td>

                  <td>

                    {

                      item.status==="SUCCESS"

                      ?

                      <span className="text-green-400">

                        성공

                      </span>

                      :

                      item.status==="FAIL"

                      ?

                      <span className="text-red-400">

                        실패

                      </span>

                      :

                      <span className="text-yellow-400">

                        진행중

                      </span>

                    }

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}