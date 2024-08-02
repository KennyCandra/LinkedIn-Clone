import React from 'react'
import styled from "styled-components";


function LikeButton() {
  return (
    <Container>
        <button>
            <img style={{ width: "20px" }} src="/images/like.svg" alt="Like" />
            <span>like</span>
        </button>
    </Container>
  )
}


const Container = styled.div``

export default LikeButton