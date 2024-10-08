import styled from "styled-components";
import { connect } from "react-redux";
import {
  addCommentAPI,
  editCommentAPI,
  removeCommentAPI,
} from "../Redux/actions";
import { useEffect, useRef, useState } from "react";
import CommentEditor from "./CommentEditor";
import { Timestamp } from "firebase/firestore";

function Comments(props) {
  const [comment, setComment] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (props.setFoucsFunction) {
      props.setFoucsFunction(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    }
  }, [props.setFocusFunction]);

  const handleAddComment = () => {
    if (!comment) return;
    const payload = {
      user: props.user,
      action: "comment",
      article: props.article,
      timestamp: Timestamp.now(),
      id: Math.random().toString(36).slice(2),
      description: comment,
      likes: [],
    };
    props.addComment(payload);
  };

  const handleClick = (e) => {
    e.preventDefault();
    handleAddComment();
    setComment("");
  };

  const handleChange = (e) => {
    setComment(e.target.value);
    inputRef.current.style.height = `10px`;
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  };

  return (
    <>
      <Container key={props.article.id}>
        <AddComment>
          <UserImage>
            <img src={props.user.photoURL} alt="" />
          </UserImage>
          <InputDiv>
            <textarea
              type="text"
              placeholder="Add a comment"
              value={comment}
              ref={inputRef}
              onChange={handleChange}
            />
            {comment !== "" && (
              <SubmitButton type="submit" onClick={handleClick}>
                Comment
              </SubmitButton>
            )}
          </InputDiv>
        </AddComment>
        {props.article.comments.length > 0 &&
          props.article.comments.map((comment, index) => (
            <Content key={index}>
              <UserImage>
                <img src={comment.Image} alt="" />
              </UserImage>
              <CommentInfo>
                <UserName>
                  <h2>{comment.name}</h2>
                </UserName>
                <CommentDescription>
                  <CommentEditor
                    article={props.article}
                    comment={comment}
                    editComment={props.editComment}
                    description={comment.description}
                    removeComment={props.removeComment}
                    user={props.user}
                  />
                </CommentDescription>
                <Interactions>
                  <button>like</button>
                  <button>reply</button>
                </Interactions>
              </CommentInfo>
            </Content>
          ))}
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1rem;
  flex-direction: column;
  input {
    border: 1px solid grey;
    &:focus {
      border: 2px solid grey;
    }
  }
`;

const Content = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
`;

const AddComment = styled.div`
  display: flex;
  gap: 1rem;
  overflow: hidden;
  resize: none;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  flex-grow: 1;
  textarea {
    padding-inline: 10px;
    padding-top: 20px;
    border-radius: 25px;
    width: 90%;
    resize: none;
  }
`;

const CommentInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const UserImage = styled.div`
  img {
    margin-inline: 20px 1px;
    width: 48px;
    border-radius: 50%;
  }
`;
const UserName = styled.div``;
const CommentDescription = styled.div`
  margin-block: 0.5rem;
`;
const Interactions = styled.div`
  display: flex;
  gap: 1rem;
  button {
    background-color: transparent;
    border: none;
    color: #8e8e8e;
    font-size: 1rem;
    cursor: pointer;
  }
`;

const SubmitButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 5px;
  background-color: #0a66c2;
  color: white;
  max-width: 100px;
`;

const mapDispatchToProps = (dispatch) => {
  return {
    addComment: (payload) => dispatch(addCommentAPI(payload)),
    removeComment: (payload, commentId) =>
      dispatch(removeCommentAPI(payload, commentId)),
    editComment: (payload, commentId, newComment) =>
      dispatch(editCommentAPI(payload, commentId, newComment)),
  };
};

const connectedApp = connect(null, mapDispatchToProps)(Comments);

export default connectedApp;
