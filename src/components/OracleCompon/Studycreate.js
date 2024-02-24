import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function Studycreate() {
    const user = useSelector((state) => state.id);
    const [studyTime, setStudyTime] = useState("");
    const [subject, setSubject] = useState("");
    const [studyDatebyself, setStudyDatebyself] = useState("");
    const navigate = useNavigate();

    const studycreate = () => {
        axios.defaults.withCredentials = true;
        if (studyTime === "" || subject === "" || studyDatebyself === "") {
            alert("請輸入時間、科目與日期");
            return;
        }
        // const apiurl = "http://192.168.0.13:3001/study/creatstudy";
        const apiurl = `${process.env.REACT_APP_API_URL}/study/creatstudy`;

        // 使用 toast.promise 來處理請求，並提供使用者友好的反饋信息
        toast.promise(
            axios.post(apiurl, {
                id: user,
                studyDatebyself: studyDatebyself,
                studytime: studyTime,
                studycontent: subject,
            }),
            {
                pending: '登記中...', // 等待中的提示信息
                success: {
                    render({ data }) {
                        console.log(data);
                        if (data.data.error === false) {
                            // 請求成功，清空輸入欄位並導航至指定頁面
                            setStudyTime("");
                            setSubject("");
                            setStudyDatebyself(""); // 清空日期選擇後的狀態
                            navigate("/LoginHome");
                            return '登記成功!'; // 成功的提示信息
                        }
                        if (data.data.error === true) {
                            return data.data.res
                        }

                    },
                    // 可以根據實際需要調整 success 信息的顯示方式
                    icon: true,
                },
                error: {
                    render({ data }) {
                        // 請求失敗，返回後端提供的錯誤信息
                        return data.response.data.error || '登記失敗!'; // 根據後端響應結構調整錯誤信息的獲取方式
                    }
                }
            }
        ).catch((err) => {
            console.log(err);
        });
    };


    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '70px' }}>
            <h2 className="mb-3">登記讀書紀錄</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="studyDatebyself" className="form-label">讀書日期</label>
                    <input
                        type="date"
                        className="form-control"
                        id="studyDatebyself"
                        onChange={(e) => setStudyDatebyself(e.target.value)}
                        value={studyDatebyself}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="studyTime" className="form-label">讀書時間 (HH:MM:SS)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="studyTime"
                        placeholder="如:01:30:00"
                        pattern="(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)"
                        title="時間格式為(HH:MM:SS)"
                        onChange={(e) => setStudyTime(e.target.value)}
                        value={studyTime}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="subject" className="form-label">讀書科目</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="輸入讀書科目"
                        onChange={(e) => setSubject(e.target.value)}
                        value={subject}
                    />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <button type="button" className="btn btn-success" onClick={studycreate}>提交</button>
                </div>
            </form>
        </div>
    );
}

export default Studycreate;
