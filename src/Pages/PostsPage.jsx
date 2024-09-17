import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import styled from "styled-components";

function PostsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    const userRef = collection(db, "articles");
    const q = query(userRef, where("id", "==", id));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          setUser(querySnapshot.docs[0].data());
        } else {
          console.log("No user found with this ID");
          setUser(null);
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
      {user ? (
        <h1 style={{ marginTop: "70px" }}>User Name: {user.actor.title}</h1>
      ) : (
        <h1 style={{ marginTop: "70px" }}>User not found</h1>
      )}
    </>
  );
}

export default PostsPage;
