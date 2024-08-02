import { Timestamp } from "firebase/firestore";
import React from "react";

function LikeTypes({ displayLike, setDisplayLike , article , setLikeType , user , likeType }) {
  return (
    <div
      style={{ display: displayLike }}
      onMouseEnter={() => setDisplayLike("flex")}
      onMouseLeave={() => setDisplayLike("none")}
    >
      <button
        style={{ background: "none" }}
        onClick={() => {
          setLikeType("love");
          const payload = {
            Timestamp: Timestamp.now(),
            id: Math.random().toString(36).slice(2),
            userName: user.displayName,
            email: user.email,
            type: likeType,
          };
          props.addLike(article, payload);
        }}
      >
        <img
          src="/images/like.svg"
          style={{ width: "20px", background: "none" }}
        />
      </button>
      <button>
        <img src="/images/love.svg" style={{ width: "20px" }} />"
      </button>
    </div>
  );
}

export default LikeTypes;
