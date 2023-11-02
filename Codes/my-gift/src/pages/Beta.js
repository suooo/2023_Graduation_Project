import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Beta.css";

function Beta() {
  const [predict, setPredict] = useState([]); //긍정 반응 채팅 내용
  const [keyword, setKeyword] = useState([]); //긍정 반응 채팅 내용의 키워드
  useEffect(() => {
    axios
      .get("/predict")
      .then((response) => {
        setPredict(predict.concat(response.data.rs));
        setKeyword(keyword.concat(response.data.kw));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const searchWord = (word) => {
    const searchUrl = `https://www.google.com/search?q=${word}`;
    window.open(searchUrl, "_blank");
  };

  const storeResult = () => {
    const blob = new Blob([predict], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "YourPick.txt"; //파일 이름
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="Beta">
      <p className="Title">Your Pick</p>
      <p className="SubTitle">개인별 취향 분석 및 추천 시스템</p>

      <div className="ResultBox">
        취향 분석 결과
        <div className="smallResultBox">
          {predict.map((p, index) => (
            <div className="ChatBox" key={index}>
              <p>{p}</p>
            </div>
          ))}
        </div>
        <button onClick={storeResult}>분석 결과 저장하기</button>
      </div>

      <div className="RecommandBox">
        추천 검색
        <div className="smallRecmdBox">
          {keyword.map((k, index) => (
            <div key={index}>
              <button className="keywordButton" onClick={() => searchWord(k)}>
                '{k}' 검색하기{" "}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Beta;
