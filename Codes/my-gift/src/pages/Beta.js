import React from "react";
import "./Beta.css";

function Beta() {
  return (
    <div className="Beta">
      <p className="Title">Your Pick</p>
      <p className="SubTitle">개인별 취향 분석 및 추천 시스템</p>

      <div className="ResultBox">취향 분석 결과</div>

      <div className="RecommandBox">추천하는 '영화'</div>
    </div>  
  );
}
export default Beta;
