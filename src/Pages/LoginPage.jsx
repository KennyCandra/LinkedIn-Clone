import styled from "styled-components";
import { checkLocalStorage, getArticlesApi, signInAPI } from "../Redux/actions";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function LoginPage(props) {
  useEffect(() => {
    props.checkUser();
  }, []);

  useEffect(() => {
    props.getArticles();
  }, []);

  const navigate = useNavigate();
  return (
    <Container>
      {props.user && navigate("/home")}
      <Nav>
        <a href="/index.html">
          <img src="/images/login-logo.svg" alt="Logo" />
        </a>
        <div>
          <Join>Join now</Join>
          <SignIn>Sign in</SignIn>
        </div>
      </Nav>
      <Section>
        <SmallContainer>
          <h1>Welcome to your professional community</h1>
          <Google onClick={() => props.signIn()}>
            <img src="/images/google.svg" alt="Google" />
            Sign in with Google
          </Google>
        </SmallContainer>
        <ImageContainer>
          <img src="/images/login-hero.svg" alt="Hero" />
        </ImageContainer>
      </Section>
    </Container>
  );
}

const Container = styled.div`
  padding: 0px;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 12px 0;
  max-width: 1128px;

  a {
    img {
      width: 102px;
    }
  }
`;

const Join = styled.a`
  font-size: 16px;
  padding: 15px 26px;
  text-decoration: none;
  border-radius: 25px;
  color: rgba(0, 0, 0, 0.8);
  margin-right: 12px;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.9);
    text-decoration: none;
  }
`;

const SignIn = styled.a`
  box-shadow: inset 0 0 0 1px #0a66c2;
  color: #0a66c2;
  border-radius: 25px;
  transition-duration: 167ms;
  font-size: 16px;
  font-weight: 600;
  margin-left: 12px;
  padding: 15px 26px;
  text-align: center;
  &:hover {
    background-color: rgba(112, 181, 249, 0.15);
    cursor: pointer;
  }
`;

const Section = styled.div`
  max-width: 1128px;
  margin: auto;
  display: flex;
  padding-top: 100px;
  h1 {
    color: #526a6e;
    line-height: 1.25;
    font-weight: 600;
    font-size: 64px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 200px;
  }
`;

const SmallContainer = styled.div`
  flex-shrink: 0;
  width: 580px;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
`;

const Google = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  height: 38px;
  width: 396px;
  padding-block: 25px;
  border-radius: 28px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 60%), inset 0 0 0 2px rgb(0 0 0 / 0%),
    inset 0 0 0 1px rgb(0 0 0 / 0%);
  color: #3c4043;
  cursor: pointer;
  transition-duration: 167ms;
  font-size: 16px;
  font-weight: 500;
  gap: 10px;

  &:hover {
    background-color: rgba(207, 207, 207, 0.25);
    color: rgba(0, 0, 0, 0.75);
  }
`;

const ImageContainer = styled.div`
  width: 50%;
  @media (max-width: 768px) {
    align-self: center;
  }
  img {
    width: 700px;
    height: 570px;
    @media (max-width: 768px) {
      width: 374px;
      height: 214px;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    articles: state.articleState.articles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: () => dispatch(signInAPI()),
    getArticles: () => dispatch(getArticlesApi()),
    checkUser: () => dispatch(checkLocalStorage()),
  };
};

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export default connectedApp;
