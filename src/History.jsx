import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function History(){

    const [history,setHistory]=useState([]);

    useEffect(()=>{

        fetch(`${API_URL}/api/history`)
        .then(res=>res.json())
        .then(data=>setHistory(data));

    },[]);

    return(

        <div className="p-5">

            <h2 className="text-3xl font-bold mb-5">

                추천 이력

            </h2>

            <table className="w-full text-center">

                <thead>

                <tr>

                    <th>추천시간</th>
                    <th>종목명</th>
                    <th>점수</th>
                    <th>추천가</th>
                    <th>현재가</th>
                    <th>최고수익률</th>
                    <th>결과</th>

                </tr>

                </thead>

                <tbody>

                {history.map(item=>(

                    <tr key={item.id}>

                        <td>{item.recommendTime}</td>

                        <td>{item.stockName}</td>

                        <td>{item.score}</td>

                        <td>{item.recommendPrice}</td>

                        <td>{item.currentPrice}</td>

                        <td>{item.maxProfitRate}%</td>

                        <td>

                            {item.status==="SUCCESS"

                            ?<span className="text-green-500">

                                SUCCESS

                            </span>

                            :item.status==="FAIL"

                            ?<span className="text-red-500">

                                FAIL

                            </span>

                            :<span className="text-yellow-500">

                                WAIT

                            </span>}

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>

    );

}