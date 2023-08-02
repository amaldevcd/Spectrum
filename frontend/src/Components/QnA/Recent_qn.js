import React, { useState, useEffect } from "react";
import NewAnswer from "./NewAnswer";
import NewQn from "./NewQn";
import "./Recent_qn.css";

const Recent_qn = (props) => {
  const [answerRecent, setAnswerRecent] = useState("");

  const token = localStorage.getItem("token");

  const addAnswerHandler = (event) => {
    setAnswerRecent(event.target.value);
  };

  const saveSolvedQuestionDataHandler = (enteredSolutionData) => { 
    const solutionData = {
      ...enteredSolutionData,
    };
    // props.onAddQuestion();
    console.log(solutionData);

  };

  const reloadQnsHandler = () => {
    props.onAddAnswer();
  };


//   const saveQnDataHandler = (enteredQnData) => {
//     const qnData = {
//         ...enteredQnData,
//         id: Math.random().toString(),
//     }
//     props.onAddQn(qnData);
//     setIsAsking(false);
// }


  return (
    <div className="recent_qn_wrapper">
      <div className="recent_qn_list">
        <div key={props.id} className="qn_description">
          <div className="recent_qn_title">{props.title}</div>
          <div className="recent_qn">Qn: {props.qn}</div>

          <div className="qn_info">
            <div className="qn_pic">
              {props.auth_pic && (
                <img
                  src={props.auth_pic}
                  alt="profile_pic"
                  className="quest_profile_pic"
                />
              )}
              {!props.auth_pic && (
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="profile_pic"
                  className="quest_profile_pic"
                />
              )}
            </div>
            <div className="recent_qn_author">{props.author}</div>
            <div className="qn_details">
              <div className="recent_qn_date">
                {new Date(props.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="solve_qn">
            <NewAnswer
              id={props.id}
              onSolveQuestion={saveSolvedQuestionDataHandler}
              onSubmitAnswer={reloadQnsHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent_qn;
