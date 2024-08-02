import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./Components/LoginPage";
import Home from "./Components/Home";
import { connect, Provider } from "react-redux";
import store from "./Redux/app/store";
import Header from "./Components/Header";
import { getUserAuth } from "./Redux/actions";
import { useEffect } from "react";
import RequireAuth from "./Components/RequireAuth";

function App(props) {
  useEffect(() => {
    props.getUserAuth;
  }, []);

  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Header />
                  <Home />
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserAuth: () => dispatch(getUserAuth()),
  };
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
