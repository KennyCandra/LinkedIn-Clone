import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import Home from "./Pages/Home";
import { connect, Provider } from "react-redux";
import store from "./Redux/app/store";
import Header from "./Components/Header";
import { getUserAuth } from "./Redux/actions";
import { useEffect } from "react";
import RequireAuth from "./Pages/RequireAuth";
import NotificationPage from "./Pages/NotificationPage";
import ProfilePages from "./Pages/ProfilePages";
import PostsPage from "./Pages/PostsPage";

function App(props) {
  useEffect(() => {
    props.getUserAuth();
  }, [props]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route
            path="/home"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
          <Route
            path="/notifications"
            element={
              <>
                <Header />
                <NotificationPage />
              </>
            }
          />
        </Route>
        <Route
          path="/profile/:id"
          element={
            <>
              <Header />
              <ProfilePages />
            </>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <>
              <Header />
              <PostsPage />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
});

const ConnectedApp = connect(null, mapDispatchToProps)(App);

const AppWithProvider = () => {
  return (
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  );
};

export default AppWithProvider;
