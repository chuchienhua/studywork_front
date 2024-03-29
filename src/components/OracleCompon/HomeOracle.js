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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.id);
  const [AppTabs, setAppTabs] = useState("Home");
  const [studyData, setStudyData] = useState([]);
  const customRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.className = 'htBody';
  };
  const colHeader = ["讀書日期", "讀書時間", "讀書科目", "儲存", "刪除"];
  const columns = [
    {
      data: "studyDatebyself", type: "date", dateFormat: "YYYY-MM-DD", // 設置你想要的日期格式
      correctFormat: true, // 確保輸入格式正確
      defaultDate: new Date().toISOString().slice(0, 10), width: 150
    },
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
    },
    {
      data: "DELETE_BTN",
      width: 80,
      readOnly: true,
      renderer: function (instance, td, row, col, prop, value, cellProperties) {
        const icon = document.createElement("SPAN");
        icon.className = "icon bi bi-database-fill-x";
        icon.innerHTML = " 刪除";

        const btn = document.createElement("SAVE_BTN");
        btn.className =
          "btn btn-outline-danger btn-sm px-1 py-0 nowrap align-top";
        btn.appendChild(icon);

        Handsontable.dom.addEvent(btn, "click", () => {
          deleteStudyData(row);
        });

        const div = document.createElement("DIV");
        div.appendChild(btn);

        Handsontable.dom.empty(td);
        td.appendChild(div);
      },
    },
  ];



  const getStudyDataByUserId = (userId) => {
    const apiurl = `${process.env.REACT_APP_API_URL}/study/get-study-data/${userId}`;

    // 使用 toast.promise 來處理請求並提供友好的使用者反饋
    toast.promise(
      axios.get(apiurl),
      {
        pending: '資料讀取中...', // 正在請求時的提示信息
        success: {
          render({ data }) {
            // 將獲得的資料按日期從大到小排序
            const sortedData = data.data.sort((a, b) => {
              // 將日期字符串轉換為日期對象進行比較
              return new Date(b.studyDatebyself) - new Date(a.studyDatebyself);
            });
            // 請求成功，更新狀態並返回成功提示信息
            setStudyData(sortedData); // 更新狀態為排序後的資料
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
      axios.post(`${process.env.REACT_APP_API_URL}/study/update-study`, {
        id: rowData._id,
        studyDatebyself: rowData.studyDatebyself,
        studytime: rowData.studytime,
        studycontent: rowData.studycontent,
      }),
      {
        pending: '正在修改...',
        success: {
          render({ data }) {
            if (data.data.status === 'success') {
              getStudyDataByUserId(user);
              return '修改成功!';
            }
            if (data.data.status === 'error') {
              return '修改失敗!';
            }
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

  const deleteStudyData = (row) => {
    const rowData = studyData[row];
    toast.promise(
      axios.post(`${process.env.REACT_APP_API_URL}/deleteStudyDataById`, {
        id: rowData._id,
      }),
      {
        pending: '正在修改...',
        success: {
          render({ data }) {
            console.log(data);
            if (data.data.status === 'success') {
              getStudyDataByUserId(user);
              return '刪除成功!';
            }
            if (data.data.status === 'error') {
              return '刪除失败!';
            }
          },
          icon: true,
        },
        error: {
          render({ data }) {
            return data.response.data.error || '刪除失败!';
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
