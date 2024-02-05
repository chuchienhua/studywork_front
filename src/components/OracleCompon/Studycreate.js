import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function Studycreate() {
    const user = useSelector((state) => state.id);
    const [studyTime, setStudyTime] = useState("");
    const [subject, setSubject] = useState("");
    const navigate = useNavigate();
    const studycreate = () => {
        axios.defaults.withCredentials = true;
        if (studyTime === "" || subject === "") {
            alert("請輸入時間與科目");
            return;
        }
        // const apiurl = Utils.getURL("oracle/getalluserauth");
        const apiurl = "https://study-work.onrender.com/study/creatstudy";
        axios
            .post(apiurl, {
                id :user,
                studytime: studyTime,
                studycontent: subject,
            })
            .then((response) => {
                console.log(response.data);
                if (response.status === "success") {
                    toast.success("登記成功!");
                } else {
                    toast.error("登記失敗!");
                }
            }).catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h2 className="mb-3">登記讀書紀錄</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="studyTime" className="form-label">讀書時間 (HH:MM:SS)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="studyTime"
                        placeholder="如:01:30:00"
                        pattern="(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)"
                        title="時間格視為(HH:MM:SS)"
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
