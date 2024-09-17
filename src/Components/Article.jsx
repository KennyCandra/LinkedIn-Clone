import React, { useEffect, useRef, useState } from "react";
import EditPostModal from "./EditPostModal";
import LikeButton from "./LikeButton";
import styled from "styled-components";
import ReactPlayer from "react-player";
import Comments from "./Comments";
import { handleDelete } from "../Redux/actions";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

function Article({
  article,
  user,
  toggleActionButton,
  articleActionButton,
  handleDelete,
  showEditModal,
  setShowEditModal,
  handleEditPostModalClick,
  addLike,
}) {
  const commentFocusFunctions = useRef({});
  const [postDescription, setPostDescription] = useState("");
  const navigate = useNavigate();

  const navigateToProfile = (uid) => {
    navigate(`/profile/${uid}`);
  };

  useEffect(() => {
    if (article.description !== postDescription) {
      setPostDescription(article.description);
    }
  }, []);

  const handleRevertChange = () => {
    setPostDescription(article.description);
  };

  const handleCommentClick = (articleId) => {
    if (commentFocusFunctions.current[articleId]) {
      commentFocusFunctions.current[articleId]();
    }
  };

  return (
    <ArticleContainer>
      {user.displayName === article.actor.title && (
        <ArticleActionButtons onClick={() => toggleActionButton(article.id)}>
          <img src="images/three-dots-svgrepo-com.svg" />
        </ArticleActionButtons>
      )}
      {articleActionButton[article.id] && (
        <ArticleActionButonsContainer>
          <ActionButton onClick={() => handleDelete(article)}>
            <img src="images/close-icon.svg" alt="" />
            Delete Post
          </ActionButton>
          <ActionButton onClick={() => setShowEditModal(!showEditModal)}>
            <img src="images/edit.svg" alt="" />
            Edit Post
          </ActionButton>

          {showEditModal && (
            <EditPostModal
              showEditModal={showEditModal}
              setShowEditModal={setShowEditModal}
              handleEditPostModalClick={handleEditPostModalClick}
              user={user}
              article={article}
              postDescription={postDescription}
              setPostDescription={setPostDescription}
              handleRevertChange={handleRevertChange}
            />
          )}
        </ArticleActionButonsContainer>
      )}
      <SharedActor>
        <a>
          <img
            src={article.actor.image}
            onClick={() => navigateToProfile(article.actor.uid)}
            alt=""
          />
          <div>
            <a
              style={{
                marginTop: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigateToProfile(article.actor.uid)}
            >
              {article.actor.title}
            </a>
            <span style={{ marginTop: "10px" }} onClick={() => navigate(`/posts/${article.id}`)}>
              {article.actor.date.toDate().toLocaleDateString()}
            </span>
          </div>
        </a>
        <button>
          <img src="/images/ellipis-icon.svg" alt="" />
        </button>
      </SharedActor>
      <Description>{postDescription}</Description>
      <SharedImg>
        <a>
          {!article.sharedImg && article.video ? (
            <ReactPlayer width={"100%"} url={article.video} />
          ) : (
            article.sharedImg && <img src={article.sharedImg} />
          )}
        </a>
      </SharedImg>
      <SocialCounts>
        <li>
          <button>
            {article.likes.length}
            <img
              style={{
                marginLeft: "5px",
                width: "20px",
                height: "20px",
              }}
              src="/images/LikeButton.svg"
              alt=""
            />
          </button>
        </li>
        <li>
          <a>{article.comments.length} comments</a>
        </li>
        <li>
          <a>1 share</a>
        </li>
      </SocialCounts>
      <SocialActions>
        <LikeButton article={article} user={user} addLike={addLike} />
        <button onClick={() => handleCommentClick(article.id)}>
          <img src="/images/comment-icon.svg" alt="" />
          <span>Comment</span>
        </button>
        <button>
          <img src="/images/share-icon.svg" alt="" />
          <span>Share</span>
        </button>
        <button>
          <img src="/images/send-icon.svg" alt="" />
          <span>Send</span>
        </button>
      </SocialActions>
      <Comments
        article={article}
        user={user}
        setFoucsFunction={(focusFn) => {
          commentFocusFunctions.current[article.id] = focusFn;
        }}
      />
    </ArticleContainer>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleDelete: (payload) => dispatch(handleDelete(payload)),
  };
};

const connectedApp = connect(null, mapDispatchToProps)(Article);
export default connectedApp;

const ArticleContainer = styled.div`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
  text-align: center;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 1px rgb(0 0 0 / 20%);
`;

const SharedActor = styled.div`
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  a {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;

    img {
      cursor: pointer;
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;

      a {
        &:hover {
          text-decoration: underline;
        }
      }
      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }
        &:nth-child(2),
        &:nth-child(3) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
  button {
    position: absolute;
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    ouline: none;
  }
`;
const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;
const SharedImg = styled.div`
  margin-top: 8px;
  width: 100%;
  diplay: block;
  position: relative;
  background-color: #f9fafb;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;
const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: center;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;
  li {
    margin-right: 5px;
    font-size: 12px;
    button {
      display: flex;
      align-items: center;
      border: none;
      background-color: white;
    }
  }
`;
const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: 100%;
  flex-wrap: wrap;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;

  @media (max-width: 267px) {
    display: block;
  }
  button {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.6);
    border: none;
    background-color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
    width: 25%;
    height: 60px;
    justify-content: center;
    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    @media (min-width: 992px) and (max-width: 1200px) {
      span {
        display: none;
      }
    }

    @media (max-width: 430px) {
      span {
        display: none;
      }
    }

    @media (max-width: 267px) {
      display: block;
      width: 100%;
    }

    @media (min-width: 768px) {
      span {
        margin-left: 8px;
        margin-top: 3px;
        font-weight: 600;
      }
    }
  }
`;

const ArticleActionButtons = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: 1rem;
  top: 5px;
  cursor: pointer;
  z-index: 1;
  transition: background 0.2s;
  border-radius: 50%;
  width: 40px;
  height: 40px;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const ArticleActionButonsContainer = styled.div`
  position: absolute;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  right: 0.5rem;
  top: 15%;
  width: 335px;
  background: #ccc;
  z-index: 1;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  gap: 5px;
  padding-block: 3px;
`;

const ActionButton = styled.button`
  background: white;
  min-height: 56px;
  border: none;
  cursor: pointer;
  display: flex;
  width: 100%;
  align-items: center;
  transition: background 0.2s;
  z-index: 9999;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  img {
    width: 20px;
    height: 20px;
    margin-right: 15px;
  }
`;
