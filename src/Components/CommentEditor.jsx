import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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
  const actionRef = useRef(null);

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  useEffect(() => {
    setNewComment(description);
  }, [description]);

  const handleClick = () => {
    setEditContent(!editContent);
    setCommentActions(false);
    setNewComment(description);
  };

  const handleClickChangeComment = (e) => {
    editComment(article, comment.id, newComment);
    setEditContent(!editContent);
  };

  const handleClickOut = (e) => {
    if (actionRef.current && !actionRef.current.contains(e.target)) {
      setCommentActions(false);
    }
  };

  useEffect(() => {
    if (commentActions) {
      document.addEventListener("mousedown", handleClickOut);
    } else {
      document.removeEventListener("mousedown", handleClickOut);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    };
  }, [commentActions]);

  return (
    <CommentContainer>
      {!editContent ? (
        <CommentContainer>
          {user.displayName === comment.name && (
            <Container>
              <Actions onClick={() => setCommentActions(!commentActions)}>
                <img src="images/three-dots-svgrepo-com.svg" />
              </Actions>
              {commentActions && (
                <ButtonActionContainer ref={actionRef}>
                  <ButtonAction
                    onClick={() =>
                      removeComment(article, comment.id) &&
                      setCommentActions(false)
                    }
                  >
                    <img src="images/close-icon.svg" alt="" />
                    <p>Delete</p>
                  </ButtonAction>
                  <ButtonAction onClick={handleClick}>
                    <img src="images/edit.svg" alt="" />
                    <p>edit</p>
                  </ButtonAction>
                </ButtonActionContainer>
              )}
            </Container>
          )}
          <p>{comment.description}</p>
        </CommentContainer>
      ) : (
        <>
          <input
            style={{
              width: "auto",
              height: "3rem",
              border: "none",
              display: "block",
              outline: "none",
            }}
            type="text"
            placeholder="Edit your Comment..."
            value={newComment}
            onChange={handleChange}
          />
          <EditActionContainer>
            <EditButton
              disabled={newComment == description}
              onClick={handleClickChangeComment}
            >
              Save Edit
            </EditButton>
            <CancelEditButton onClick={handleClick}>Cancel</CancelEditButton>
          </EditActionContainer>
        </>
      )}
    </CommentContainer>
  );
}

const CommentContainer = styled.div`
  display: flex;
  p {
    font-size: 15px;
    text-align: left;
  }
`;

const Container = styled.div`
  p {
    text-align: left;
    line-height: 1.5;
  }
`;

const Actions = styled.button`
  background: none;
  cursor: pointer;
  border: none;
  position: absolute;
  right: 1rem;
  top: 0;

  img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const ButtonActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 10rem;
  position: absolute;
  right: 1rem;
  top: 1.2rem;
  border-radius: 5px;
  padding: 0.5rem;
  z-index: 100;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 0;
`;

const ButtonAction = styled.button`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  align-items: center;
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  padding: 10px;
  cursor: pointer;
  background-color: white;

  &:hover {
    background-color: #ccc;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const EditActionContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  border: 1p solid black;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const EditButton = styled.button`
  background: #0a66c2;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: 0.4s ease;
  color: white;
  padding: 10px;

  &:disabled {
    color: black;
    background-color: rgba(0, 0, 0, 0.08);
  }
`;
const CancelEditButton = styled.button``;

export default CommentEditor;
