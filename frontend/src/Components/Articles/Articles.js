import React, { useState, useEffect } from "react";
import "./Articles.css";
import JobDate from "../Jobs/JobDate";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

// in your react component

const Articles = (props) => {
  const [showFullText, setShowFullText] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [reported, setReported] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [loadComments, setLoadComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const formatter = buildFormatter(frenchStrings);

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
  };

  const handleShowComments = () => {
    setShowComments(true);
  };

  const handleHideComments = () => {
    setShowComments(false);
  };

  const handleLike = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/blogs/like/${props.id}`,
        {
          method: "PUT",
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
        console.log("Likes updated" + response.json());
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
      } else {
        console.error("Error updating likes");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const maxCharsToShow = 200; // or whatever maximum number of characters you want to show initially
  const text = props.article || "";
  const truncatedText = text.slice(0, maxCharsToShow);

  const handleShowMoreClick = () => {
    setShowFullText(true);
    // document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowFullText(false);
    document.body.style.overflow = "initial";
  };

  const handleReport = (e) => {
    e.preventDefault();
    setReported(true);
  };
  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    console.log(props._id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/blogs/comment/${props.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Fetch comments" + data);
      setLoadComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [comments]);

  const commentSubmitHandler = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    const content = comment;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/blogs/addcomment/${props.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, id: props.id }),
        }
      );

      if (response.ok) {
        // Comment added successfully
        console.log("Added comment" + response.json());
        setComments([...comments, comment]);
        fetchComments();
      } else {
        // Handle error case
        console.error("Error adding comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="article">
      <div className="a_description">
        <div className="a_title">{props.title}</div>

        <div className="blog_topic_content">
          {props.tags && props.tags.length > 0
            ? props.tags.map((tag, index) => (
                <span key={index} className="blog_topic_tag">
                  {tag}
                </span>
              ))
            : ""}
        </div>
        <div className="blog">
          {/* {props.tags && props.tags.length>0? <div className="blog_topic">
            <div className="blog_topic_title">Topic: </div> */}

          {/* </div>:[]} */}
          <div>
            {!showFullText && (
              <p onClick={handleShowMoreClick} style={{ cursor: "pointer" }}>
                {truncatedText}
              </p>
            )}
          </div>

          {showFullText && (
            <div className="blog_details">
              <div className="blog_details_content">
                <div>
                  <span
                    className="blog_detailsclose"
                    onClick={handleCloseModal}
                  >
                    ×
                  </span>
                  <div className="blog_details_title">{props.title}</div>
                  {props.image && (
                    <img
                    src={props.image}
                    alt="hi"
                    className="blog_details_img"
                  ></img>
                  )}
                  <p className="blog_details_blog">{props.article}</p>
                  <div className="blog_detailsauthor">{props.author} </div>
                  {/* <div className="likes">Likes: {props.likes}</div> */}
                  {props.likes +" "}
                  <button className="likebutton" onClick={handleLike}>
                    {liked ? (
                      <i className="fas fa-thumbs-down"></i>
                    ) : (
                      <i className="fas fa-thumbs-up"></i>
                    )}
                  </button>
                  <div className="comments">
                    {!showComments && (
                      <button
                        className="viewcommentsbutton"
                        onClick={handleShowComments}
                      >
                        View Comments
                      </button>
                    )}
                    {showComments && (
                      <>
                        <div className="comment_details">
                          <div className="comment_detail">
                            <div>
                              <form
                                className="addComment"
                                onSubmit={commentSubmitHandler}
                              >
                                <input
                                  className="comment_input"
                                  type="text"
                                  name="comment"
                                  placeholder="Add a comment"
                                  style={{ textAlign: "center" }}
                                ></input>
                                <button type="submit">Comment</button>
                              </form>
                            </div>
                            <span
                              className="comment_detailsclose"
                              onClick={handleHideComments}
                            >
                              ×
                            </span>
                            {loadComments.map((commentGroup) => (
                              <div
                                key={commentGroup._id}
                                className="comment_blogs"
                              >
                                {commentGroup.comments.map((comment) => (
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
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="author_identity">
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
            <div className="author">{props.author}</div>
            <div className="a_date">
              {new Date(props.date).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
