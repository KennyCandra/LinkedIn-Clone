import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  checkLocalStorage,
  getNotificationsAPI,
  openNotification,
} from "../Redux/actions";
import { useNavigate } from "react-router-dom";

function Notifications(props) {
  const [button, setButton] = useState("all");
  const [className, setClassName] = useState("active");
  const navigate = useNavigate();
  const [newNotificationArr, setNewNotificationArr] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      await props.getNotificationsAPI(props.user.uid);
      setNewNotificationArr(props.notifications);
    };
    const updateData = async () => {
      await props.openNotification(props.user);
    };
    updateData();
    fetchData();
  }, []);

  useEffect(() => {
    !props.user ? navigate("/home") : null;
  }, []);

  const handleClick = (item) => {
    setButton(item);
    setClassName(item);
  };

  // useEffect(() => {
  //   if (button === "all") {
  //     setNewNotificationArr(notificationArr);
  //   } else {
  //     const newFilteredArr = notificationArr.filter(
  //       (notification) => notification.action === button
  //     );
  //     setNewNotificationArr(newFilteredArr);
  //   }
  // }, [button]);

  return (
    <Container>
      <ButtonsContainer>
        <button
          className={className === "all" ? "active" : null}
          onClick={() => handleClick("all")}
        >
          All
        </button>
        <button
          className={className === "my-posts" ? "active" : null}
          onClick={() => handleClick("my-posts")}
        >
          My Posts
        </button>
        <button className={className === "mention" ? "active" : null}>
          Mention
        </button>
      </ButtonsContainer>
      <NotificationsContainer>
        {newNotificationArr ? (
          newNotificationArr.length === 0 ? (
            <h1>No Notifications</h1>
          ) : (
            newNotificationArr.map((notification, index) => (
              <NotificationsDiv key={index}>
                <NotificationImage
                  src={notification.Image}
                  alt={notification.name}
                />
                <NotificationInfo>
                  <NotificationUserName>
                    {notification.name}
                  </NotificationUserName>
                  <NotificationAction>
                    {notification.action} on your post:
                  </NotificationAction>
                  <NotificationText>
                    {notification.description}
                  </NotificationText>
                </NotificationInfo>
              </NotificationsDiv>
            ))
          )
        ) : null}
      </NotificationsContainer>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 70px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  justify-self: center;
  min-width: 607px;
  max-width: 607px;
  margin-inline: auto;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  background-color: #ccc;
  align-items: flex-start;
  border-radius: 5px;
  border: 1px solid grey;
  padding: 0.7rem;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid grey;
    border-radius: 50px;
    cursor: pointer;
    background-color: white;
  }

  button.active {
    background-color: green;
  }
`;

const NotificationsContainer = styled.div`
  background-color: #ccc;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
`;

const NotificationsDiv = styled.div`
  display: flex;
  border: 0.5px solid grey;
  align-items: flex-end;
  padding-bottom: 10px;

  &:first-child {
    border-top: 0.5px solid grey;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  &:last-child {
    border-bottom: 0.5px solid grey;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

const NotificationImage = styled.img`
  width: 40px;
  height: 40px;
  margin-inline: 10px;
  margin-top: 10px;
  border-radius: 50%;
`;

const NotificationInfo = styled.div`
  max-width: 500px;
  padding-block: 10px;
`;

const NotificationUserName = styled.p`
  display: inline-block;
  font-weight: 600;
  font-size: 15px;
  margin-right: 5px;
`;

const NotificationAction = styled.p`
  display: inline-block;
  font-weight: 400;
  font-size: 13px;
`;

const NotificationText = styled(NotificationAction)``;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    notifications: state.notificationState.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkUser: () => dispatch(checkLocalStorage()),
    getNotificationsAPI: (uid) => dispatch(getNotificationsAPI(uid)),
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

const connectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);

export default connectedApp;
