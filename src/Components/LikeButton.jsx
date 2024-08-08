import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
};

const likeTypesArray = Object.values(likeTypes).slice(1);

function LikeButton({ article, user, addLike }) {
  const [appear, setAppear] = React.useState(false);
  const currentLike = article.likes.find((like) => like.email === user.email);
  const likeType = currentLike ? currentLike.type : "none";
  const [hoverTime, setHoverTime] = useState(null);

  useEffect(() => {
    console.log(hoverTime)
  },[hoverTime])

  const handleMouseOver = () => {
    setHoverTime(setTimeout(() => setAppear(true), 1000));
  };

  const handleMouseLeave = () => {
    if(hoverTime) {
      clearTimeout(hoverTime);
      setHoverTime(null);
    }
    setAppear(false);
  }

  useEffect(() => {
    console.log(appear);
  }, [appear]);

  const handleLike = (likeTypeAPI) => {
    const payload = {
      Timestamp: Timestamp.now(),
      id: Math.random().toString(36).slice(2),
      userName: user.displayName,
      email: user.email,
      type: likeTypeAPI,
    };
    console.log(payload);
    addLike(article, payload);
    setAppear(false);
    clearTimeout(hoverTime);
    setHoverTime(null);
  };

  return (
    <>
      <button
        onClick={
          likeType === "none"
            ? () => handleLike("Like")
            : () => handleLike(likeTypes[likeType].type)
        }
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <img
          style={{ width: "20px", filter: likeTypes[likeType].filter }}
          src={likeTypes[likeType].icon}
          alt="Like"
        />
        <span
          style={{
            color: likeTypes[likeType].spanColor,
            transition: "transform 0.2s ease-in-out",
          }}
        >
          {likeType === "none" ? "Like" : likeType}
        </span>
      </button>
      <LikeTypesContainer
        style={appear ? { opacity: 1 } : { opacity: 0 }}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <ListOfIcons>
          {likeTypesArray.map((likeType) => (
            <ListedIcons>
              <button
                onClick={() => handleLike(likeType.type)}
                style={{ background: "none" }}
              >
                <img
                  style={{
                    width: "30px",
                    height: "30px",
                    filter: likeType.filter,
                  }}
                  src={likeType.icon}
                />
              </button>
            </ListedIcons>
          ))}
        </ListOfIcons>
      </LikeTypesContainer>
    </>
  );
}

const LikeTypesContainer = styled.div`
  width: 15rem;
  position: absolute;
  top: 7rem;
  background-color: white;
  border: 1px solid black;
  border-radius: 2%;
  box-shadow: 5px 2px #888888;
  transition: 0.2s ease;
`;

const ListOfIcons = styled.ul`
  display: flex;
  list-style: none;
  width: 100%;
  height: 50px;
  padding-inline: 10px;
`;
const ListedIcons = styled.li`
  style: none;
  width: 20%;
  button {
    background-color: transparent;
    border: none;
    &:hover {
      background-color: none;
    }
  }

  img {
    &:hover {
      transform: scale(1.2);
      transition: transform 0.2s ease-in-out;
    }
  }
`;

export default LikeButton;
