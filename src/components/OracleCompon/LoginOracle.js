import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Replace with the appropriate import for your router library
import { useDispatch } from "react-redux"
import Utils from "../../Utils";
import "./LoginOracle.css";
import { toast } from "react-toastify";


function LoginOracle() {
  const url = "https://study-work.onrender.com"
  const dispatch = useDispatch();
  const [id, setid] = useState("");
  const [pw, setpw] = useState("");
  const navigate = useNavigate();
  const loginHandle = () => {
    axios.defaults.withCredentials = true;
    if (id === "" || pw === "") {
      alert("請輸入帳號密碼");
      return;
    }
    const apiurl = `${process.env.REACT_APP_API_URL}/study/findmember`;

    // 使用 toast.promise 包裹你的登录请求
    toast.promise(
      axios.post(apiurl, {
        id: id,
        pw: pw,
      }),
      {
        pending: '登入中...',
        success: {
          render({data}) {
            dispatch({ type: "LOGIN_SUCCESS", payload: data.data });
            navigate("/LoginHome");
            return '登入成功!';
          },
          icon: true,
        },
        error: {
          render({data}) {
            dispatch({ type: "LOGIN_FAILURE" });
            return data.response.data.error || '登入失敗!'; 
          }
        }
      }
    ).catch((err) => {
      console.log(err);
    });
};


  return (
    <div className="container " style={{ maxWidth: '400px', marginTop: '70px' }}>
      <h2 className="mb-3 ">登入</h2>
      <form>
        <div className="mb-3 mt-2">
          <label htmlFor="username" className="form-label">帳號</label>
          <input type="text" className="form-control" id="username" placeholder="輸入帳號" onChange={(e) => setid(e.target.value)} value={id} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">密碼</label>
          <input type="password" className="form-control" id="password" placeholder="輸入密碼" onChange={(e) => setpw(e.target.value)} value={pw} />
        </div>
        <button type="button" className="btn btn-primary" onClick={loginHandle}>登入</button>
      </form>
    </div>
  );
}
export default LoginOracle;
