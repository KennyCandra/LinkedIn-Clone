import { useEffect, useState } from "react";
import { connect } from "react-redux";
import PostModal from "./PostModal";
import styled from "styled-components";
import {
  getArticlesApi,
  handleDelete,
  editArticleAPI,
  addLike,
} from "../Redux/actions";
import ReactPlayer from "react-player";
import Comments from "./Comments";
import LikeButton from "./LikeButton";
import EditModal from "./EditModal";

function Main(props) {
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleClick = () => {
    setShow(!show);
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
            Start a Box
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
              <Article key={index}>
                {props.user.displayName === article.actor.title && (
                  <>
                  <button onClick={() => props.handleDelete(article)}>
                    Delete Post
                  </button>
                  <button onClick={() => setShowEditModal(!showEditModal)}>
                    Edit Post
                  </button>
                  </>
                )}
                <SharedActor>
                  <a>
                    <img src={article.actor.image} alt="" />
                    <div>
                      <span style={{ marginTop: "5px" }}>
                        {article.actor.title}
                      </span>
                      <span style={{ marginTop: "10px" }}>
                        {article.actor.date.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  </a>
                  <button>
                    <img src="/images/ellipis-icon.svg" alt="" />
                  </button>
                </SharedActor>
                <Description>{article.description}</Description>
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
                        src="https://static-exp1.licdn.com/sc/h/2uxqgankkcxm505qn812vqyss"
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
                 <LikeButton article={article} user ={props.user} addLike={props.addLike}  />
                  <button>
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
                <Comments article={article} user={props.user} />
                <EditModal showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
              </Article>
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
  }
`;
const Content = styled.div`
  text-align: center;
  & > img {
    width: 70px;
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
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
  button {
    display: inline-flex;
    align-items: center;
    padding: 8px;
    color: rgba(0, 0, 0, 0.6);
    border: none;
    background-color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
    width: calc(100% / 4);
    height: 60px;
    justify-content: center;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
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

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(Main);

export default connectedApp;
