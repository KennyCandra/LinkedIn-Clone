import React, {useState} from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { editArticle } from "../Redux/actions/actions";
import { editArticleAPI } from "../Redux/actions";

function EditPostModal({
  showEditModal,
  setShowEditModal,
  handleEditPostModalClick,
  user,
  article,
  editArticleAPI
}) {
  const [textArea, setTextArea] = useState(article.description);
  const [assetArea, setAssetArea] = useState("");
  const [image, setImage] = useState("");
  const [videoLink, setVideoLink] = useState("");

  const reset = (e) => {
    setTextArea("");
    setAssetArea("");
    setImage("");
    setVideoLink("");
    props.handleClick(e);
  };

  const handleEditPostClick = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    editArticleAPI(article, textArea);
    reset(e);
    setShowEditModal(false);
  };

  const switchAssetArea = (area) => {
    setAssetArea(area);
    setVideoLink("");
    setImage("");
  };

  const handleChange = (e) => {
    const newImg = e.target.files[0];
    if (newImg === "" || newImg === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }
    setImage(newImg);
  };

  return (
    {showEditModal } && (
      <Container>
        <Content>
          <Header>
            <h2>Edit Your Post</h2>
            <button onClick={() => setShowEditModal(false)}>
              <img
                style={{ zIndex: "100" }}
                src="/images/close-icon.svg"
                alt="Close"
              />
            </button>
          </Header>
          <ShareContent>
            <UserInfo>
              {user && user.photoURL ? (
                <img src={user.photoURL} />
              ) : (
                <img src="/images/user.svg" />
              )}

              <span>{user.displayName}</span>
            </UserInfo>
            <Editor>
              <textarea
                value={textArea}
                onChange={(e) => setTextArea(e.target.value)}
                placeholder="What do you want to talk about?"
              />
              {assetArea === "image" ? (
                <UploadImage>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    name="image"
                    onChange={handleChange}
                  />
                  <p>
                    <label
                      htmlFor="file"
                      style={{
                        cursor: "pointer",
                        display: "block",
                        marginBottom: "15px",
                      }}
                    >
                      Select an image to share
                    </label>
                  </p>
                  {image && <img src={URL.createObjectURL(image)} />}
                </UploadImage>
              ) : (
                assetArea === "video" && (
                  <>
                    <input
                      type="text"
                      placeholder="video URL"
                      value={videoLink}
                      style={{ width: "100%", height: "30px" }}
                      onChange={(e) => setVideoLink(e.target.value)}
                    />
                    {videoLink && (
                      <ReactPlayer width={"100%"} url={videoLink} />
                    )}
                  </>
                )
              )}
            </Editor>
          </ShareContent>
          <ShareCreation>
            <AttachAssets>
              <AssetButton
                style={{ zIndex: "100" }}
                onClick={() => switchAssetArea("image")}
              >
                <img src="/images/share-image.svg" alt="" />
              </AssetButton>
              <AssetButton onClick={() => switchAssetArea("video")}>
                <img src="images/share-video.svg" alt="" />
              </AssetButton>
            </AttachAssets>
            <ShareComment>
              <AssetButton src="/public/images/item-icon.svg">
                <span>Anyone</span>
              </AssetButton>
            </ShareComment>
            <PostButton
              onClick={(e) => handleEditPostClick(e)}
              disabled={!textArea ? true : false}
            >
              Edit
            </PostButton>
          </ShareCreation>
        </Content>
      </Container>
    )
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;
const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 99%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
  button {
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s ease;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  align-items: center;
  h2 {
    line-height: 1.5;
    font-weight: 400;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.6);
  }
  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    background: none;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
  svg,
  img {
    pointer-events: none;
  }
`;
const ShareContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  sv,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }
  span {
    font-weight: 600;
    line-height: 1.5;
    font-size: 16px;
    margin-left: 5px;
  }
`;
const ShareCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 16px 16px;
  height: 30px;
`;
const AssetButton = styled.button`
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  font-size: 14px;
  background: none;
  color: black;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;
const AttachAssets = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  ${AssetButton} {
    width: 40px;
  }
`;
const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  display: grid;
  place-items: center;
  ${AssetButton} {
    svg,
    img {
      margin-right: 5px;
    }
    padding: 10px;
    height: 30px;
    border-radius: 30px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
`;
const PostButton = styled.button`
  min-with: 60px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) =>
    props.disabled ? "rgb(235,235,235)" : "#0a66c2"};
  color: ${(props) => (props.disabled ? "rgb(0,0,0,0.25)" : "white")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: 500;
  font-size: 16px;
  border-radius: 30px;
  &:hover {
    background: ${(props) => (props.disabled ? "" : "#004182")};
  }
`;
const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    font-size: 16px;
    font-weight: 400;
    outline: none;
    border: none;
    line-height: 1.5;
  }
`;
const UploadImage = styled.div`
  text-align: center;
  color: black;
  img {
    width: 100%;
  }
`;

const mapDispatchToProps = (dispatch) => {
  return {
    editArticleAPI: (payload, newPost) => {
      dispatch(editArticleAPI(payload, newPost));
    },
  };
};

const connectedApp = connect(null, mapDispatchToProps)(EditPostModal);

export default connectedApp;
