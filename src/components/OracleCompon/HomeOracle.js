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
  const columns = [
    { data: "studyDate", type: "text", width: 150, readOnly: true },
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
    const apiurl = `http://192.168.0.13:3001/study/get-study-data/${userId}`;
    axios
      .get(apiurl)
      .then((res) => {
        setStudyData(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
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
    axios.post('http://192.168.0.13:3001/study/update-study', {
      id: rowData._id, // 確保你的資料中有 `id` 欄位
      studytime: rowData.studytime,
      studycontent: rowData.studycontent,
    })
    .then((response) => {
      if(response.data.status ==='success'){
        toast.success("修改成功!");
      }else if(response.data.status ==='error'){
        toast.success("修改失敗!");
      }

    })
    .catch((error) => {
      console.error('Error saving data', error);
      // 處理錯誤，可能是顯示錯誤信息給用戶
    });
  };
  

  return (
    <div className="custom-background">
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
