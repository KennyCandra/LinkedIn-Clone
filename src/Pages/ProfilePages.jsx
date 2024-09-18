import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import styled from "styled-components";

function ProfilePages() {
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      const userRef = collection(db, "users");
      const q = query(userRef, where("uid", "==", id));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setUser(querySnapshot.docs[0].data());
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  }, []);

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <ImagesContainer>
        <Background src={"/images/background.jpg"} />
        <Image src={user.photoURL} alt="profile photo" />
      </ImagesContainer>
      <div style={{padding: '16px'}}>
        <Header>{user.name}</Header>
        <Description>{user.email}</Description>
        <ButtonContainer>
          <ActionButton onClick={() => console.log(user.photoURL)}>
            Open to
          </ActionButton>
          <ActionButton>Add Profile Section</ActionButton>
          <ActionButton>Enhance Profile</ActionButton>
          <ActionButton>More</ActionButton>
        </ButtonContainer>
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 70px;
  max-width: 804px;
  margin-inline: auto;
  background-color: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15), 0 0 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
`;

const ImagesContainer = styled.div`
  position: relative;
  margin-bottom: 70px;
`;

const Background = styled.img`
  max-width: 804px;
  border-radius: 5px;
`;

const Image = styled.img`
  border-radius: 50%;
  border: 1px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0);
  width: 150px;
  height: 150px;
  position: absolute;
  left: 25px;
  bottom: -50px;
`;

const Header = styled.h1`
  font-size: 2rem;
  width: 321px;
  text-transform: capitalize;
  margin: 0px 0px 10px 0px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`;

const Description = styled.p`
  font-size: 1.3rem;
  color: rgba(0, 0, 0, 0.8);
  margin: 0px 0px 10px 0px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding-block: 12px;
`;

const ActionButton = styled.button`
  width: auto;
  height: 20px;
  border-radius: 15px;
  border: none;
  background-color: white;
  border: 1px solid #0a66c2;
  cursor: pointer;
  padding-inline: 30px;
  padding-block: 16px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  color: #468bd1;
  &:first-child {
    color: white;
    background-color: #0a66c2;
    height: 20px;
  }

  &:last-child {
    color: black;
    border: 1px solid black;
  }
`;

export default ProfilePages;
