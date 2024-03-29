import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, } from "react-toastify";

/* 컴포넌트 */
import Header from './component/info/Header';
import Footer from './component/info/Footer';
import Main from './component/main/Main';
import Coggle from './component/coggle/Coggle';
import CoggleDetail from './component/coggle/CoggleDetail';
import CoggleWrite from './component/coggle/CoggleWrite';
import CoggleEdit from './component/coggle/CoggleEdit';
import Cokkiri from './component/recruit/cokkiri/Cokkiri';
import CokkiriDetail from './component/recruit/cokkiri/CokkiriDetail';
import CokkiriWrite from './component/recruit/cokkiri/CokkiriWrite';
import CokkiriEdit from './component/recruit/cokkiri/CokkiriEdit';
import Mammoth from './component/recruit/mammoth/Mammoth';
import MammothDetail from './component/recruit/mammoth/MammothDetail';
import MammothWrite from './component/recruit/mammoth/MammothWrite';
import MammothEdit from './component/recruit/mammoth/MammothEdit';
import MessengerFrame from './component/chat/MessengerFrame.js';
import MyPage from './component/mypage/MyPage';
import SideAnimation from './component/info/SideAnimation';

function App() {

  const token = useSelector( state=> state.Authorization );
  const userId = useSelector( (state) => {return state.UserId} );
  /* useEffect(() => {
    const handleBeforeUnload = (event) => {
      // 페이지 새로고침 여부 확인
      const isPageRefreshed = !event.persisted;
      if (isPageRefreshed) {
        const formData = new FormData();
        formData.append('userId', userId)

        axios.post("/chat-room-disconnect", formData)
        .then(()=>{

        })
        .catch(()=>{

        })
      } 
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
  }, []); */
  return (
    <div className="App">
      <BrowserRouter>
      {    console.log("\n%c   \u2022\u2666\ufe0e \u2666\ufe0e\u2022\n%c \u2022\u2666\ufe0e\u2666\ufe0e\u25a0\u25a0\u25a0\u25a0\u2666\ufe0e\u2666\ufe0e\u2022\n%c\u2022\u2666\ufe0e\u25a0\u2666\ufe0e\u2022  \u2022\u2666\ufe0e\u25a0\u2666\ufe0e\u2022\n%c\u2666\ufe0e\u25a0\u25cf      \u25cf\u25a0\u2666\ufe0e\n%c\u25cf\u25a0\u2666\ufe0e \ud83c\udc62  \ud83c\udc62 \u2666\ufe0e\u25a0\u25cf\n%c\u2666\ufe0e\u25a0\u25cf      \u25bc\u25a0\u2666\ufe0e\n%c\u2022\u2666\ufe0e\u25a0\u2666\ufe0e\u2022 \u2022\u25b2\ufe45\u25a0\u2666\ufe0e\n%c \u2022\u2666\ufe0e\u2666\ufe0e\u25a0\u25a0\u25a0\u25a0\u2666\ufe0e\u2666\ufe0e\u2022\n%c   \u2022\u2666\ufe0e \u2666\ufe0e\u2022\n", "color:#4e5bff;font-size:14px;line-height:14px;font-familly: monospace;", "color:#4e5bff;font-size:14px;line-height:14px;font-familly: monospace;", "color:#4e5bff;font-size:14px;line-height:14px;font-familly: monospace;", "color:#4e5bff;font-size:14px;line-height:14px;font-familly: monospace;", "color:#4e5bff;font-size:14px;line-height:14px;font-familly: monospace;", "color:#4e5bff;font-size:14px;line-height:14px;font-familly: monospace;", "color:#4e5bff;font-size:14px;line-height:14px;font-familly: monospace;", "color:#6a4eff;font-size:14px;line-height:14px;font-familly: monospace;", "color:#6a4eff;font-size:14px;line-height:14px;font-familly: monospace;")}
        <InitScroll />{/* Router를 통해 컴포넌트 전환시 스크롤 초기화 */}
        <Header/>
        <SideAnimation/>
        { (token!=''&&userId!='' )&& <MessengerFrame/>}
        <Routes>
              <Route path='/' element={<Main />} />
              <Route path='/coggle' element={<Coggle />} />
              <Route path='/coggle-write' element={<CoggleWrite />} />
              <Route path='/coggle-detail/:coggleNo' element={<CoggleDetail />} />
              <Route path='/coggle-edit' element={<CoggleEdit />} />
              <Route path='/cokkiri' element={<Cokkiri />} />
              <Route path='/cokkiri-write' element={<CokkiriWrite />} />
              <Route path='/cokkiri-detail/:cokkiriNo' element={<CokkiriDetail />} />
              <Route path='/cokkiri-edit' element={<CokkiriEdit />} />
              <Route path='/mammoth' element={<Mammoth />} />
              <Route path='/mammoth-write' element={<MammothWrite />} />
              <Route path='/mammoth-detail/:mammothNo' element={<MammothDetail />} />
              <Route path='/mammoth-edit' element={<MammothEdit />} />
              <Route path='/mypage' element={<MyPage />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

function InitScroll() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 이동 후 스크롤 위치를 맨 위로 이동
  }, [location]);
}

export default App;
