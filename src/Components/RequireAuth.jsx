import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function RequireAuth({user , children}) {
    const navigate = useNavigate()


    useEffect(() => {
        if(!user){
            navigate('/' , {replace: true})
            return;
        } 
    },[user])
  return children
}

const mapStateToProps = (state) => {
  return {
    user: state.userState.user
  }
}

const connectedApp = connect(mapStateToProps)(RequireAuth)

export default connectedApp