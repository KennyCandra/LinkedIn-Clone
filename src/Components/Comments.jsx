import styled from "styled-components";
import { connect } from "react-redux";
import {
  addCommentAPI,
  editCommentAPI,
  removeCommentAPI,
} from "../Redux/actions";
import { useEffect, useRef, useState } from "react";
import CommentEditor from "./CommentEditor";

function Comments(props) {
  const [comment, setComment] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if(props.setFoucsFunction) {
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
      user : props.article.user,
      action: "comment",
      article: props.article,
      description: comment,
      uid : props.article.uid,
      Image: props.user.photoURL,
      name: props.user.displayName,
      articleId: props.article.id,
      id: Math.random().toString(36).slice(2),
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
  };

  return (
    <>
      <Container key={props.article.id}>
        <AddComment>
          <UserImage>
            <img src={props.user.photoURL} alt="" />
          </UserImage>
          <input
            type="text"
            placeholder="Add a comment"
            value={comment}
            ref={inputRef}
            onChange={handleChange}
          />
          <SubmitButton type="submit" onClick={handleClick}>
            Comment
          </SubmitButton>
        </AddComment>
        {props.article.comments.length > 0 &&
          props.article.comments.map((comment) => (
            <Content>
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
  position: relative;
  gap: 1rem;
  input {
    width: 100%;
    height: 1.5rem;
    border-radius: 25px;
    outline: none;
    padding: 0.5rem;
    padding-right: 100px;
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
  position: absolute;
  right: 1rem;
  top: 0.8rem;
  border: none;
  background: transparent;
  color: #958b7b;
  cursor: pointer;
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
