import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const likeTypes = {
  none: {
    type: "none",
    icon: "/images/like.svg",
    filter: "none",
  },
  Like: {
    type: "Like",
    icon: "/images/like.svg",
    spanColor: "blue",
    filter:
      "invert(40%) sepia(57%) saturate(2728%) hue-rotate(196deg) brightness(102%) contrast(98%)",
  },
  Love: {
    type: "Love",
    icon: "/images/love.svg",
    spanColor: "red",
    filter:
      "invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg) brightness(95%) contrast(112%)",
  },
  Insghitful: {
    type: "Insghitful",
    icon: "/images/lamp.svg",
    spanColor: "#F4BB2C",
    filter: "none",
  },
  laughing: {
    type: "laughing",
    icon: "/images/laughing.svg",
    spanColor: "#F7B239",
    filter: "none",
  },
  notLauging: {
    type: "notLauging",
    icon: "/images/laughing.svg",
    spanColor: "#F7B239",
    filter: "none",
  },
  WOW: {
    type: "WOW",
    icon: "/images/laughing.svg",
    spanColor: "#F7B239",
    filter: "none",
  },
};

const likeTypesArray = Object.values(likeTypes).slice(1);

function LikeButton({ article, user, addLike }) {
  const currentLike = article.likes.find((like) => like.email === user.email);
  const likeType = currentLike ? currentLike.type : "none";
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [websiteTypeLike, setWebsiteTypeLike] = useState(likeType || "none");
  const [disableLikeButton, setDisableLikeButton] = useState(false);

  useEffect(() => {
    setWebsiteTypeLike(likeType);
  }, [likeType]);

  useEffect(() => {
    if (disableLikeButton) {
      setTimeout(() => {
        setDisableLikeButton(false);
      }, 100);
    }
  }, [disableLikeButton]);

  const handleLike = async (likeTypeAPI) => {
    const previousLikeType = websiteTypeLike;
    setDisableLikeButton(true);
    setWebsiteTypeLike(likeTypeAPI);
    setIsMenuVisible(false);

    const payload = {
      Timestamp: Timestamp.now(),
      id: Math.random().toString(36).slice(2),
      userName: user.displayName,
      email: user.email,
      type: likeTypeAPI,
    };
    try {
      await addLike(article, payload);
    } catch (error) {
      setWebsiteTypeLike(previousLikeType);
    }
  };

  const handleMouseDown = () => {
    setIsMenuVisible(false);
  };

  const handleMouseEnter = () => {
    setIsMenuVisible(true);
  };

  return (
    <>
      <LikeButtonAction
        onMouseLeave={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        disabled={disableLikeButton}
        onClick={
          likeType === "none"
            ? () => handleLike("Like")
            : () => handleLike(likeTypes[websiteTypeLike].type)
        }
      >
        <img
          style={{ filter: likeTypes[websiteTypeLike].filter }}
          src={likeTypes[websiteTypeLike].icon}
          alt="Like"
        />
        <span
          style={{
            color: likeTypes[websiteTypeLike].spanColor,
            transition: "transform 0.2s ease-in-out",
          }}
        >
          {websiteTypeLike === "none" ? "Like" : websiteTypeLike}
        </span>
        {isMenuVisible && (
          <LikeTypesContainer>
            {likeTypesArray.map((likeType, i) => (
              <ListedIcons
                key={i}
                onClick={() => handleLike(likeType.type)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img
                  style={{
                    filter: likeType.filter,
                  }}
                  src={likeType.icon}
                />
              </ListedIcons>
            ))}
          </LikeTypesContainer>
        )}
      </LikeButtonAction>
    </>
  );
}

const LikeButtonAction = styled.button`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  img {
    width: 20px;
    height: 20px;
  }
`;

const LikeTypesContainer = styled.div`
  position: absolute;
  display: flex;
  width: 150%;
  height: 2.3rem;
  justify-content: space-evenly;
  align-items: center;
  left: 10px;
  top: -30px;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  box-shadow: 5px 2px #888888;
  padding-inline: 10px;
`;

const likeAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
        transform: translateY(-5px);

  }
  100% {
        transform: translateY(0);

  }
`;
const ListedIcons = styled.div`
  animation: ${likeAnimation} 0.5s;
  button {
    background-color: transparent;
    border: none;
    &:hover {
      background-color: none;
    }
  }

  img {
    width: 25px;
    height: 25px;
    padding: 0;
    &:hover {
      transform: scale(1.2);
      transition: transform 0.2s ease-in-out;
    }
  }
`;

export default LikeButton;
