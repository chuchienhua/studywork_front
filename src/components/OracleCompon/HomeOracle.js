import React, { useState, useEffect } from "react";
import "./HomeOracle.css";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Utils from "../../Utils";
import { registerAllCellTypes } from "handsontable/cellTypes";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import { toast } from "react-toastify";
function HomeOracle() {
  registerAllCellTypes();
  const url = "https://study-work.onrender.com";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.id);
  const [AppTabs, setAppTabs] = useState("Home");
  const [studyData, setStudyData] = useState([]);
  const customRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.className = 'htBody';
  };
  const columns = [
    { data: "studyDatebyself", type: "text", width: 150, readOnly: true },
    { data: "studytime", type: "numeric", width: 200 },
    { data: "studycontent", type: "text", width: 200 },
    {
      data: "SAVE_BTN",
      width: 80,
      readOnly: true,
      renderer: function (instance, td, row, col, prop, value, cellProperties) {
        const icon = document.createElement("SPAN");
        icon.className = "icon bi-save";
        icon.innerHTML = " 儲存";

        const btn = document.createElement("SAVE_BTN");
        btn.className =
          "btn btn-outline-success btn-sm px-1 py-0 nowrap align-top";
        btn.appendChild(icon);

        Handsontable.dom.addEvent(btn, "click", () => {
          saveStudyData(row);
        });

        const div = document.createElement("DIV");
        div.appendChild(btn);

        Handsontable.dom.empty(td);
        td.appendChild(div);
      },
    }
  ];

  const colHeader = ["讀書日期", "讀書時間", "讀書科目", "儲存"];

  const getStudyDataByUserId = (userId) => {
    const apiurl = `https://study-work.onrender.com/study/get-study-data/${userId}`;

    // 使用 toast.promise 來處理請求並提供友好的使用者反饋
    toast.promise(
      axios.get(apiurl),
      {
        pending: '資料讀取中...', // 正在請求時的提示信息
        success: {
          render({ data }) {
            // 請求成功，更新狀態並返回成功提示信息
            setStudyData(data.data); // 根據實際返回的資料結構可能需要調整
            return '資料讀取成功！';
          },
          icon: true, // 是否顯示圖標
        },
        error: {
          render({ data }) {
            // 請求失敗，返回後端提供的錯誤信息或預設錯誤提示
            return data.response.data.error || '資料讀取失敗！'; // 根據後端響應結構調整
          }
        }
      }
    ).catch((err) => {
      console.error('Error fetching data', err);
      // 處理可能的錯誤，這裡的 catch 主要是為了捕捉到 toast.promise 之外的異常，例如網絡錯誤等
    });
  };


  const formatStudyTime = (timeString) => {
    const isValidFormat = /^(\d{1,2}):(\d{2}):(\d{2})$/.test(timeString);
    if (!isValidFormat) {
      console.error('Invalid time format');
      return null; // 或返回一个默认值，或者根据需要处理
    }
    // 如果已经是正确的格式，直接返回
    return timeString;
  };

  const saveStudyData = (row) => {
    const rowData = studyData[row];
    const formattedStudyTime = formatStudyTime(rowData.studytime);
    if (!formattedStudyTime) {
      toast.error("格式錯誤，請使用 hh:mm:ss 格式！");
      return;
    }
    toast.promise(
      axios.post('https://study-work.onrender.com/study/update-study', {
        id: rowData._id,
        studyDatebyself: rowData.studyDatebyself,
        studytime: rowData.studytime,
        studycontent: rowData.studycontent,
      }),
      {
        pending: '正在修改...',
        success: {
          render({ data }) {
            return '修改成功!';
          },
          icon: true,
        },
        error: {
          render({ data }) {
            return data.response.data.error || '修改失败!';
          }
        }
      }
    ).then(response => {
      // 
    }).catch(error => {
      console.error('Error saving data', error);
      // 
    });
  };


  return (
    <div className="custom-background mt-5">
      <div>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => {
            getStudyDataByUserId(user);
          }}
        >
          <span className="icon bi-plus-circle"></span> 查詢
        </button>
      </div>
      <div className="mt-1 customHandsontableStyle">
        <HotTable
          filter={false}
          dropdownMenu={false}
          className="handsontable"
          style={{ textAlign: "center" }}
          licenseKey="non-commercial-and-evaluation"
          data={studyData}
          columns={columns}
          colHeaders={colHeader}
          rowHeaders={false}
        />
      </div>
    </div>
  );
}

export default HomeOracle;
