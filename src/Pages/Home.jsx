import styled from "styled-components";
import LeftSide from "../Components/LeftSide";
import Main from "../Components/Main";
import RightSide from "../Components/RightSide";

function Home() {
  return (
    <Container>
      <Layout>
        <LeftSide />
        <Main />
        <RightSide />
      </Layout>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 52px;
  max-width: 100%;
  background-color: #f4f2ee;
  @media (max-width: 992px) {
    margin-top: 24px;
  }
`;
const Layout = styled.div`
  display: grid;
  max-width: 1128px;
  margin: auto;
  margin-top: 65px;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: 225px 555px 300px;
  column-gap: 25px;
  row-gap: 25px;

  @media (max-width: 1200px) {
    grid-template-columns: 225px 387px 300px;
  }

  @media (max-width: 992px) {
    grid-template-columns: 225px 471px;
    grid-template-areas:
      "leftside main"
      ". rightside";
      justify-content: center;
  }

  @media (max-width: 768px) {
    grid-template-areas:
      "leftside"
      "main"
      "rightside";
    grid-template-columns: 576px;
  }

  @media (max-width: 576px) {
  grid-template-columns: 98%;
  }
`;
export default Home;
