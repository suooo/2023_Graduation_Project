import React from "react";
import "./Alpha.css";

function Alpha() {
  return (
    <div className="Alpha">
      <p className="Title">Your Pick</p>
      <p className="SubTitle">개인별 취향 분석 및 추천 시스템</p>
      <img src="/img/manual3.png" className="Manual" alt="manual" />
      <br />
      <button className="startButton">
        <img src="/img/start.png" className="startImg" alt="취향 분석 시작" />
        취향 분석 시작
      </button>
    </div>
  );
}
export default Alpha;
