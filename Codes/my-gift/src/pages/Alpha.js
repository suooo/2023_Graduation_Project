import React from "react";
import { useNavigate } from "react-router-dom";
import "./Alpha.css";

function Alpha() {
  const movePage = useNavigate();

  const moveBeta = () => {
    movePage("/Beta");
  };

  return (
    <div className="Alpha">
      <p className="Title">Your Pick</p>
      <p className="SubTitle">개인별 취향 분석 및 추천 시스템</p>
      <img src="/img/manual3.png" className="Manual" alt="manual" />

      <input type="file" />

      <br />
      <button onClick={moveBeta} className="startButton">
        <img src="/img/start.png" className="startImg" alt="취향 분석 시작" />
        취향 분석 시작
      </button>
    </div>
  );
}
export default Alpha;
