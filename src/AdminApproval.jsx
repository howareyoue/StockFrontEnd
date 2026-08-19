import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminApproval() {

  const [users, setUsers] = useState([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const loadPendingUsers = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/api/admin/pending`,
        { headers: getAuthHeader() }
      );

      setUsers(res.data);

    } catch (err) {

      console.error(err);
      alert("승인 대기 회원 조회 실패");
    }
  };

  useEffect(() => {

    loadPendingUsers();

  }, []);

  const approveUser = async (id) => {

    try {

      await axios.put(
        `${API_URL}/api/admin/approve/${id}`,
        null,
        { headers: getAuthHeader() }
      );

      alert("승인 완료");

      loadPendingUsers();

    } catch (err) {

      console.error(err);
      alert("승인 실패");
    }
  };

  const rejectUser = async (id) => {

    try {

      await axios.put(
        `${API_URL}/api/admin/reject/${id}`,
        null,
        { headers: getAuthHeader() }
      );

      alert("거절 완료");

      loadPendingUsers();

    } catch (err) {

      console.error(err);
      alert("거절 실패");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        관리자 승인 페이지
      </h1>

      {users.length === 0 ? (

        <div className="text-zinc-400">
          승인 대기 회원이 없습니다.
        </div>

      ) : (

        <div className="space-y-4">

          {users.map((user) => (

            <div
              key={user.id}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5"
            >
              <div className="grid grid-cols-4 gap-4">

                <div>
                  <div className="text-zinc-400 text-sm">
                    아이디
                  </div>

                  <div>
                    {user.username}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400 text-sm">
                    이름
                  </div>

                  <div>
                    {user.name}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400 text-sm">
                    이메일
                  </div>

                  <div>
                    {user.email}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">

                  <button
                    onClick={() => approveUser(user.id)}
                    className="bg-green-500 text-black px-4 py-2 rounded-xl font-bold"
                  >
                    승인
                  </button>

                  <button
                    onClick={() => rejectUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    거절
                  </button>

                </div>

              </div>
            </div>

          ))}

        </div>

      )}

    </div>
  );
}