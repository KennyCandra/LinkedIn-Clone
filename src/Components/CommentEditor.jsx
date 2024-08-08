import { useEffect, useState } from "react";

function CommentEditor({
  comment,
  editComment,
  article,
  description,
  removeComment,
  user,
}) {
  const [newComment, setNewComment] = useState(null);
  const [editContent, setEditContent] = useState(false);
  const [commentActions, setCommentActions] = useState(false);

  useEffect(() => {
    console.log(commentActions);
  }, [commentActions]);

  const handleChange = (e) => {
    setNewComment(e.target.value);
    console.log(newComment);
  };

  useEffect(() => {
    setNewComment(description);
  }, [description]);

  const handleClick = () => {
    setEditContent(!editContent);
    console.log(newComment);
  };

  const handleClickChangeComment = (e) => {
    editComment(article, comment.id, newComment);
    setEditContent(!editContent);
  };

  return (
    <>
      <div>
        {!editContent ? (
          <>
            <button
              onClick={() => setCommentActions(!commentActions)}
              style={{
                background: "none",
                cursor: "pointer",
                border: "none",
                position: "absolute",
                right: "1rem",
                top: "0.8rem",
                border: "none",
              }}
            >
              <img
                src="images/three-dots-svgrepo-com.svg"
                style={{ width: "20px", height: "20px", pointer: "cursor" }}
                alt=""
              />
            </button>
            {commentActions && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid red",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid red",
                  }}
                >
                  <button
                    onClick={() => removeComment(article, comment.id)}
                    style={{
                      border: "1px solid red",
                      cursor: "pointer",
                    }}
                  >
                    {" "}
                    <img
                      src="images/close-icon.svg"
                      style={{ width: "20px", height: "20px" }}
                      alt=""
                    />
                  </button>
                </div>
                <button onClick={handleClick}>Edit</button>
              </div>
            )}
            <p contentEditable={editContent}>{newComment}</p>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Add Comment..."
              value={newComment}
              onChange={handleChange}
            />
            <div>
              <button
                style={{ background: "blue" }}
                onClick={handleClickChangeComment}
              >
                Save Edit
              </button>
              <button style={{ background: "red" }} onClick={handleClick}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    editComment: (payload, commentId, newComment) =>
      dispatch(editCommentAPI(payload, commentId, newComment)),
  };
};

export default CommentEditor;
