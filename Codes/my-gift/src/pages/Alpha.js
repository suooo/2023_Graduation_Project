import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Alpha.css";

function Alpha() {
  const movePage = useNavigate();

  const moveBeta = () => {
    movePage("/Beta");
  };

  const [fileContent, setFileContent] = useState("");
  const [file, setFile] = useState(null);

  const chatting = [];

  const uploadedFile = (e) => {
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

  const modifyChatting = () => {
    const array = fileContent.toString().split("\n");

    const name = array[0].split(" 님과"); //대화 상대의 이름
    const name_length = name[0].length; //대화 상대 이름의 길이

    var chat_name;
    for (var i = 3; i < array.length; i++) {
      //채팅을 보낸 사람들의 이름
      chat_name = array[i].slice(1, name_length + 1);

      //대화 상대의 채팅만 걸러내기
      if (array[i].startsWith("[") && chat_name === name[0]) {
        chatting.push(array[i].slice(1 + name_length + 12));
      }
    }
    //console.log("카톡 내용 : " + chatting);
  };

  const dataPost = () => {
    axios
      .post("/post", {
        message: chatting,
      })
      .then(function (response) {
        console.log(response);
        alert("파일 업로드를 완료했습니다!");
      })
      .catch(function (error) {
        console.log(error);
        alert("파일 내용을 확인하고 다시 업로드해주세요.");
      });
  };

  return (
    <div className="Alpha">
      <p className="Title">Your Pick</p>
      <p className="SubTitle">개인별 취향 분석 및 추천 시스템</p>
      <img
        src="/img/manual1.png"
        className="Manual"
        alt="카카오톡 대화 내용 내보내기"
      />

      <div className="UploadPart">
        <input type="file" accept=".txt" onChange={uploadedFile} />
        {/*파일 수정 및 POST 버튼*/}
        <button
          onClick={() => {
            modifyChatting();
            dataPost();
          }}
          className="uploadButton"
        >
          <img
            src="/img/file_blue.png"
            className="fileUploadImg"
            alt="파일 업로드"
          />
          <br />
        </button>
      </div>

      <br />
      <br />
      <br />
      <button onClick={moveBeta} className="startButton">
        취향 분석 시작
      </button>
    </div>
  );
}
export default Alpha;
