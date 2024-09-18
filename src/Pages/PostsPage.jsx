import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Article from "../Components/Article";
import styled from "styled-components";
import { connect } from "react-redux";
import { addLike } from "../Redux/actions";

function PostsPage(props) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    setLoading(true);
    const userRef = collection(db, "articles");
    const q = query(userRef, where("id", "==", id));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          setArticle(querySnapshot.docs[0].data());
        } else {
          console.log("No user found with this ID");
          setArticle(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user: ", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {article ? (
        <Container>
          <Article
            article={article}
            user={props.user}
            addLike={props.addLike}
          />
        </Container>
      ) : (
        <h1 style={{ marginTop: "70px" }}>User not found</h1>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addLike: (article, payload) => dispatch(addLike(article, payload)),
  };
};
const connectedApp = connect(mapStateToProps, mapDispatchToProps)(PostsPage);

const Container = styled.div`
  max-width: 555px;
  margin-top: 72px;
  margin-inline: auto;
`;

export default connectedApp;
