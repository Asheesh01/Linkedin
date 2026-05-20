import { useState, useEffect } from 'react'
import Navbar from './components/NavBar1/NavBar1'
import Landing from './pages/Landingpage/Landingpage'
import Footer from './components/Footer/footer'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Sign up/signup'
import Login from './pages/Login/Login'
import Navbar2 from './components/Navbar2/Navbar2'
import Feeds from './pages/Feed/Feeds'
import MyNetwork from './pages/MyNetwork/MyNetwork'
import Resume from './pages/Resume/Resume'
import Message from './pages/Meassage/Message'
import Profile from './pages/Profile/Profile'
import Allactivities from './pages/Allactivities/Allactivites'
import SingleActivity from './pages/Singleactivity/SingleActivity'
import Notification from './pages/Notification/Notification'
import api from './api';

function App() {
  const [isLogin, setIsLogin] = useState(null); // null = still checking
  const [authChecked, setAuthChecked] = useState(false);

  // On startup, verify token with backend instead of trusting localStorage blindly
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await api.get(
          '/api/auth/self',
          { withCredentials: true }
        );
        setIsLogin(true);
        localStorage.setItem("isLogin", "true");
      } catch (err) {
        // Token invalid or missing — clear stale state
        setIsLogin(false);
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
      } finally {
        setAuthChecked(true);
      }
    };
    verifyAuth();
  }, []);

  const changeLoginValue = (val) => {
    setIsLogin(val);
  };

  // Show nothing while checking auth (avoids flash redirect)
  if (!authChecked) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#e9d5ff' }}>
        <div style={{ fontSize: '18px', color: '#581c87', fontWeight: '600' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {isLogin ? <Navbar2 /> : <Navbar />}
      <Routes>
        <Route path='/' element={isLogin ? <Navigate to={'/feed'} /> : <Landing changeLoginValue={changeLoginValue} />} />

        <Route path='/signUp' element={isLogin ? <Navigate to={'/feed'} /> : <Signup changeLoginValue={changeLoginValue} />} />

        <Route path='/Login' element={isLogin ? <Navigate to={'/feed'} /> : <Login changeLoginValue={changeLoginValue} />} />

        <Route path='/feed' element={isLogin ? <Feeds /> : <Navigate to={'/Login'} />} />

        <Route path='/mynetwork' element={isLogin ? <MyNetwork /> : <Navigate to={'/Login'} />} />

        <Route path='/resume' element={isLogin ? <Resume /> : <Navigate to={'/Login'} />} />

        <Route path='/message' element={isLogin ? <Message /> : <Navigate to={'/Login'} />} />

        <Route path='/profile/:id' element={isLogin ? <Profile /> : <Navigate to={'/Login'} />} />

        <Route path='/profile/:id/activities' element={isLogin ? <Allactivities /> : <Navigate to={'/Login'} />} />

        <Route path='/profile/:id/activities/:postId' element={isLogin ? <SingleActivity /> : <Navigate to={'/Login'} />} />

        <Route path='/Notifications' element={isLogin ? <Notification /> : <Navigate to={'/Login'} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
