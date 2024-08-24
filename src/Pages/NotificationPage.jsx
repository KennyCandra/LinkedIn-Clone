import React from 'react'
import styled from 'styled-components';
import LeftSide from '../Components/LeftSide';
import RightSide from '../Components/RightSide';
import Notifications from '../Components/Notifications';

function NotificationPage() {
  return (
        // <Layout>
            // <RightSide />
            <Notifications />
            // <LeftSide />
        // </Layout>
  )
}


const Layout = styled.div`
  display: grid;
  padding-inline: 20%;
  grid-template-areas: "leftside notifications rightside";
  grid-template-columns: minmax(0, 5fr) minmax(0, 12fr) minmax(300px, 7fr);
  column-gap: 25px;
  row-gap: 50px;
  margin-top: 4rem;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
  }
`;

export default NotificationPage