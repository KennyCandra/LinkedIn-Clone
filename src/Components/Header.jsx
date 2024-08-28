import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";
import { getNotificationsAPI, signOutAPI } from "../Redux/actions";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Header(props) {
  const [signOut, setSignOut] = useState(false);
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const location = useLocation();
  const [newArr, setNewArr] = useState([]);

  useEffect(() => {
    props.getNotificationsAPI(props.user.uid);
  }, []);

  useEffect(() => {
    if (props.notifications.length > 0) {
      const filetredArr = props.notifications.filter(
        (notification) => notification.seen === false
      );
      setNewArr(filetredArr);
    }
  }, [props.notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setSignOut(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNotificationButtonClick = () => {
    if (location.pathname !== "/notifications") {
      navigate("/notifications");
    }
  };

  return (
    <Container>
      <Navigation>
        <LeftSideContainer>
          <Logo>
            <a href="/home">
              <img src="/images/home-logo.svg" alt="Logo" />
            </a>
          </Logo>
          <Search>
            <div>
              <input type="text" placeholder="Search" />
              <SearchIcon>
                <img src="/images/search-icon.svg" alt="Search" />
              </SearchIcon>
            </div>
          </Search>
        </LeftSideContainer>
        <NavListWrap>
          <NavList className={location.pathname === "/home" ? "active" : null}>
            <button onClick={() => navigate("/home")}>
              <img src="/images/nav-home.svg" alt="Home" />
              <span>Home</span>
            </button>
          </NavList>
          <NavList
            className={location.pathname === "/nothing" ? "active" : null}
          >
            <button>
              <img src="/images/nav-network.svg" alt="Home" />
              <span>My NetWork</span>
            </button>
          </NavList>
          <NavList
            className={location.pathname === "/nothing" ? "active" : null}
          >
            <button>
              <img src="/images/nav-jobs.svg" alt="Home" />
              <span>Jobs</span>
            </button>
          </NavList>
          <NavList
            className={location.pathname === "/nothing" ? "active" : null}
          >
            <button>
              <img src="/images/nav-messaging.svg" alt="Home" />
              <span>Messaging</span>
            </button>
          </NavList>
          <NavList
            className={location.pathname === "/notifications" ? "active" : null}
          >
            <button onClick={handleNotificationButtonClick}>
              <img
                src="/images/nav-notifications.svg"
                alt="Home"
                style={{
                  transform:
                    location.pathname === "/notifications" && "rotate(45deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
              <span>notifications</span>
              {newArr.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "10px",
                    color: "white",
                    top: "0",
                    right: "30%",
                  }}
                >
                  <p style={{ color: "white", fontSize: "10px" }}>
                    {newArr.length}
                  </p>
                </div>
              )}
            </button>
          </NavList>
          <NavList
            className={location.pathname === "/nothing" ? "active" : null}
          >
            <button onClick={() => setSignOut(!signOut)} ref={buttonRef}>
              {props.user && props.user.photoURL ? (
                <img src={props.user.photoURL} alt="User" className="user" />
              ) : (
                <img src="/images/user.svg" alt="User" className="user" />
              )}
              <span>
                Me
                <img src="/images/down-icon.svg" alt="User" />
              </span>
            </button>
            {signOut && (
              <SignOut>
                <button onClick={() => props.signOut()}>Sign Out</button>
              </SignOut>
            )}
          </NavList>
          <NavList>
            <button>
              <img src="/images/nav-work.svg" alt="Work" />
              <span>
                Work
                <img src="/images/down-icon.svg" alt="down-icon" />
              </span>
            </button>
          </NavList>
        </NavListWrap>
      </Navigation>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  left: 0;
  top: 0;
  padding: 0 24px;
  width: 100vw;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
`;

const LeftSideContainer = styled.div`
  display: flex;
`;

const Logo = styled.span`
  margin-right: 8px;
  width: 41px;
  height: 41px;
  font-size: 0px;
`;

const Search = styled.div`
  opacity: 1;
  flex-grow: 1;
  position: relative;
  @media (max-width: 1024px) {
    flex-grow: unset;
  }
  & > div {
    max-width: 280px;
    input {
      border: none;
      box-shadow: none;
      background-color: #eef3f8;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.9);
      width: 218px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      border-color: #dce6f1;
      vertical-align: text-top;
      @media (max-width: 1024px) {
        display: none;
      }
    }
  }
`;

const SearchIcon = styled.div`
  width: 40px;
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 2px;
  border-radius: 0 2px 2px 0;
  margin: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1024px) {
    position: relative;
  }
  img {
    width: 50%;
  }
`;

const Navigation = styled.nav`
  min-height: 100%;
  max-width: 1128px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  li:last-child {
    border-left: 1px solid rgb(0, 0, 0, 0.12);
  }
`;

const appear = keyframes`
0% {
  transform : scaleX(0);
}
100% {
  transform : scaleX(1);
}
`;

const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;
  .active {
    span:after {
      content: "";
      transform: scaleX(1);
      border-bottom: 2px solid var(--white, #fff);
      bottom: 0;
      left: 0;
      position: absolute;
      animation : ${appear} 0.2s ease-in-out ;
      width: 100%;
      border-color: rgba(0, 0, 0, 0.9);
    }
`;

const NavList = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  button {
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 52px;
    min-width: 80px;
    position: relative;
    text-decoration: none;

    img.user {
      width: 24px;
      height: 24px;
      border-radius: 50%;

      &:active {
        transform: scale(0.9);
      }
    }
    span {
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
    }
    @media (max-width: 768px) {
      min-width: 70px;
    }
  }
  &:hover,
  &:active {
    a {
      span {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }

  button {
    span {
      @media (max-width: 854px) {
        display: none;
      }
    }
  }
`;

const SignOut = styled.div`
  position: absolute;
  top: 110%;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  height: 30px;

  &:hover {
    text-decoration: underline;
  }
`;

const mapStateToProps = (state) => {
  return {
    notifications: state.notificationState.notifications,
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOutAPI()),
    getNotificationsAPI: () => dispatch(getNotificationsAPI()),
    openedNotification: (payload) => dispatch(openedNotification(payload)),
  };
};

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(Header);

export default connectedApp;
