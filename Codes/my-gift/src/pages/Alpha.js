import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Alpha.css";
import $ from "jquery"; //
window.$ = $; //

function Alpha() {
  const movePage = useNavigate();

  const moveBeta = () => {
    movePage("/Beta");
  };

  const [fileContent, setFileContent] = useState("");
  const [modifiedContent, setModifiedContent] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleModification = () => {
    const updatedContent = fileContent + "\nlove"; //
    var array = fileContent.toString().split("\n");

    const name = array[0].split(" 님과"); //대화 상대의 이름 ex.정대만
    //console.log("name: " + name);
    const name_length = name[0].length; //대화 상대 이름의 길이 ex.3
    //console.log("name_length: " + name_length);

    var chat_name;
    for (var i = 3; i < array.length; i++) {
      //채팅을 보낸 사람의 이름 ex.정대만, 송태섭
      chat_name = array[i].slice(1, name_length + 1);
      //console.log(i + " chat_name: " + chat_name);

      //if (array[i].startsWith("[")) console.log(array[i]);

      //정대만의 채팅만 걸러내기
      if (array[i].startsWith("[") && chat_name === name[0]) {
        array[i] = array[i].slice(1 + name_length + 12);
        console.log(array[i]);
      }
    }
    setModifiedContent(updatedContent); //
  };

  const downloadFile = () => {
    const modifiedBlob = new Blob([modifiedContent], { type: "text/plain" });
    const url = URL.createObjectURL(modifiedBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "modified_file.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  /*
  const uploadFile = async (e) => {
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file_from_react", file);

    try {
      const res = await axios.post("http://192.168.200.161:5000/upload", data);
      alert("문제없이 실행됐습니다.");
      console.log(res.data);
    } catch (err) {
      alert("실패했습니다.");
    }
  };*/

  return (
    <div className="Alpha">
      <p className="Title">Your Pick</p>
      <p className="SubTitle">개인별 취향 분석 및 추천 시스템</p>
      <img src="/img/manual3.png" className="Manual" alt="manual" />

      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={handleModification}>Modify File</button>
      <button onClick={downloadFile} disabled={!modifiedContent}>
        Download Modified File
      </button>

      <br />
      <button onClick={moveBeta} className="startButton">
        <img src="/img/start.png" className="startImg" alt="취향 분석 시작" />
        취향 분석 시작
      </button>
    </div>
  );
}
export default Alpha;
