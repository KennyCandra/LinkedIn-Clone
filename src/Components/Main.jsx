import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import PostModal from "./PostModal";
import styled from "styled-components";
import {
  getArticlesApi,
  handleDelete,
  editArticleAPI,
  addLike,
} from "../Redux/actions";
import Article from "./Article";
import EditModal from "./EditModal";

function Main(props) {
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [articleActionButton, setArticleActionButton] = useState({});

  const toggleActionButton = (articleId) => {
    setArticleActionButton((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const handleClick = () => {
    setShow(!show);
  };

  const handleEditPostModalClick = () => {
    setShowEditModal(!showEditModal);
  };


  useEffect(() => {
    props.getArticles();
  }, []);

  return (
    <Container>
      <ShareBox>
        <div>
          {props.user && props.user.photoURL ? (
            <img src={props.user.photoURL} />
          ) : (
            <img src="/images/user.svg" />
          )}
          <button onClick={handleClick} disabled={props.loading ? true : false}>
            Start a Post
          </button>
        </div>
        <div>
          <button>
            <img src="/images/photo-icon.svg" alt="" />
            <span>Photo</span>
          </button>
          <button>
            <img src="/images/video-icon.svg" alt="" />
            <span>Video</span>
          </button>
          <button>
            <img src="/images/event-icon.svg" alt="" />
            <span>Event</span>
          </button>
          <button>
            <img src="/images/article-icon.svg" alt="" />
            <span>Write article</span>
          </button>
        </div>
      </ShareBox>
      {props.articles.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Loading articles...</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {props.loading && (
              <img style={{ width: "100px" }} src="/images/loader.svg" />
            )}
          </div>
        </div>
      ) : (
        <Content>
          {props.loading && <img src="/images/loader.svg" />}
          {props.articles.length > 0 &&
            props.articles.map((article, index) => (
              <Article
                article={article}
                user={props.user}
                toggleActionButton={toggleActionButton}
                articleActionButton={articleActionButton}
                handleDelete={props.handleDelete}
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                handleEditPostModalClick={handleEditPostModalClick}
                addLike={props.addLike}
              />
            ))}
        </Content>
      )}
      {show && <PostModal show={show} handleClick={handleClick} />}
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.articleState.loading,
    user: state.userState.user,
    articles: state.articleState.articles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArticles: () => dispatch(getArticlesApi()),
    handleDelete: (payload) => dispatch(handleDelete(payload)),
    editArticle: (payload, newPost) =>
      dispatch(editArticleAPI(payload, newPost)),
    addLike: (article, payload) => dispatch(addLike(article, payload)),
  };
};
const Container = styled.div`
  grid-area: main;
`;
const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 1px rgb(0 0 0 / 20%);
`;
const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background: white;
  div {
    button {
      outline: none;
      color: rgba(0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s ease;
      border-radius: 5px;
      &:hover {
        background: rgba(0, 0, 0, 0.08);
      }
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 8px 16px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background: white;
        color: rgba(0, 0, 0, 0.7);
        font-weight: 500;
        font-size: 14px;
        &:hover {
          background: rgba(0, 0, 0, 0.08);
        }
        text-align: left;
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      button {
        img {
          margin: 0 4px;
        }
        span {
          color: #70b5f9;
          margin-top: 2px;
        }
      }
    }


      @media (max-width: 1200px) {
        &:nth-child(2) {
        justify-content: space-around;
          button{
            width: 30%;
          }
        }
      }

      @media (max-width: 992px) {
        &:nth-child(2) {
          button{
            width: auto;
          }
        }
      }

    }
  }
`;
const Content = styled.div`
  text-align: center;
  & > img {
    width: 70px;
  }
`;

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(Main);

export default connectedApp;
