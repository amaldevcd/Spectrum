import React, { useState } from "react";
import "./Qns.css";
import NewAnswer from "./NewAnswer";

const Qns = (props) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newAnswer, setNewAnswer] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
  };

  const handleShowComments = (answerId) => {
    setShowComments(true);
    setSelectedAnswerId(answerId);
  };

  const handleHideComments = () => {
    setShowComments(false);
    setSelectedAnswerId(null);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleHideAnswer = () => {
    setShowAnswer(false);
  };

  const newAnswerHandler = () => {
    setNewAnswer(true);
  };

  const saveSolvedQuestionDataHandler = (enteredSolutionData) => {
    const solutionData = {
      ...enteredSolutionData,
    };
    console.log(solutionData);
    // props.fetchQnA();
    
  };

  const reloadQnaHandler = () => {
    props.onAddAnswer();
  };

  const token = localStorage.getItem("token");

  const handleLike = async () => {
    console.log(props.id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/qna/likeQuestion/${props.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            likes: liked ? likes - 1 : likes + 1,
            id: props.id,
          }),
        }
      );
      if (response.ok) {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
      } else {
        console.error("Error updating likes");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const commentSubmitHandler = async (event, answerId) => {
    event.preventDefault();
    console.log(answerId);
    const comment = event.target.comment.value;
    const content = comment;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/qna/answer/${answerId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, id: props.id }),
        }
      );

      if (response.ok) {
        // Comment added successfully
        setComments([...comments, comment]);
        props.onAddcomment();
        console.log("Comment added successfully");
      } else {
        // Handle error case
        console.error("Error adding comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="question_wrapper">
      <div className="qn_wrapper" id={props.id}>
        {/* <div><img src={props.image} alt='profile' className='answer_img' /></div> */}
        <div className="qn_title">{props.title} </div>

        <div className="qn_answering" onClick={handleShowAnswer} style={{ cursor: 'pointer' }}>
          {props.qn}?{" "}
        </div>
        <div className="topics">
          <b>Tags:</b> {props.topics}{" "}
        </div>
        <div className="solver_identity">
          <div className="qn_pic">
            {props.auth_pic && (
              <img
                src={props.auth_pic}
                alt="profile_pic"
                className="qn_profile_pic"
              />
            )}
            {!props.auth_pic && (
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="profile_pic"
                className="qn_profile_pic"
              />
            )}
          </div>
          <div className="asker">{props.author}</div>
          <div className="likes">
            {props.likes + " "} 
            <button className="likebutton" onClick={handleLike}>
              {liked ? (
                <i className="fas fa-thumbs-down"></i>
              ) : (
                <i className="fas fa-thumbs-up"></i>
              )}
            </button>
          </div>
          <div className="answer_count">
            <b>Answers {props.answer.length}</b>
          </div>
        </div>

        <div className="answer_show">
          {showAnswer && (
            <div className="ans_details">
              <div className="ans_details_content">
                <div>
                  <span className="ans_detailsclose" onClick={handleHideAnswer}>
                    ×
                  </span>
                </div>
                <div>
                  <div className="qn_answering">{props.qn}? </div>
                  {props.answer.map((ans) => (
                    <div className="answer" key={ans._id}>
                      <div className="solver_identity">
                        <div className="qn_pic">
                          {ans.answerer.profilePicture && (
                            <img
                              src={ans.answerer.profilePicture}
                              alt="profile_pic"
                              className="qn_profile_pic"
                            />
                          )}
                          {!ans.answerer.profilePicture && (
                            <img
                              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                              alt="profile_pic"
                              className="qn_profile_pic"
                            />
                          )}
                        </div>
                        <div className="asker">{ans.answerer.name}</div>
                      </div>
                      <div>{ans.content}</div>

                      <div className="comments">
                        {!showComments && (
                          <div className="view_comments_button">
                            <button
                              className="viewcommentsbutton"
                              onClick={() => handleShowComments(ans._id)}
                            >
                              View Comments
                            </button>
                          </div>
                        )}
                        {showComments && selectedAnswerId === ans._id && (
                          <>
                            <div className="comment_details">
                              <div className="comment_detail">
                                <div className="addcomments">
                                  <form
                                    className="addComment"
                                    onSubmit={(event) =>
                                      commentSubmitHandler(event, ans._id)
                                    }
                                  >
                                    <input
                                      className="add_comment_input"
                                      type="text"
                                      name="comment"
                                      placeholder="Add a comment"
                                      style={{ textAlign: "center" }}
                                    ></input>
                                    <button type="submit">Comment</button>
                                  </form>
                                </div>
                                <div className="hide_comment">
                                  <span
                                    className="comment_details_close"
                                    onClick={handleHideComments}
                                  >
                                    ×
                                  </span>
                                </div>
                                {ans.comments.map((comment) => (
                                  <div
                                    key={comment._id}
                                    className="comment_wrapper"
                                  >
                                    <div className="commenter_img">
                                      {comment.commenter.profilePicture && (
                                        <img
                                          src={comment.commenter.profilePicture}
                                          alt="profile_pic"
                                          className="qn_profile_pic"
                                        />
                                      )}
                                      {!comment.commenter.profilePicture && (
                                        <img
                                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                          alt="profile_pic"
                                          className="qn_profile_pic"
                                        />
                                      )}
                                    </div>

                                    <div className="commenter">
                                      {" "}
                                      {comment.commenter.name}
                                    </div>
                                    <div className="comment_time">
                                      <small>
                                        {new Date(
                                          comment.createdAt
                                        ).toLocaleDateString(undefined, {
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </small>
                                    </div>
                                    <div className="comment_content">
                                      {comment.content}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* {comments.map((comment, index) => ( <div key={index}>{comment}</div> ))} */}

                <div className="new_Answer">
                  {!newAnswer && (
                    <NewAnswer
                      id={props.id}
                      onSolveQuestion={saveSolvedQuestionDataHandler}
                      onAddAns={reloadQnaHandler}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Qns;
