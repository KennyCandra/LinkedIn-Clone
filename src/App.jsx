import { BrowserRouter as Router , Route , Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './Components/LoginPage/LoginPage'
import Home from './Components/Home'
import { Provider } from 'react-redux'
import store from './Redux/app/store'
import Header from './Components/Header'


function App() {

  return (
    <>
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<>
        <Home />
        <Header />
        </>} />
      </Routes>
    </Router>
    </Provider>
    </>
  )
}

export default App
