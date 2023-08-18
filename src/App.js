import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/* 컴포넌트 */
import Header from './component/info/Header';
import Footer from './component/info/Footer';
import Main from './component/main/Main';
import Coggle from './component/coggle/Coggle';
import CoggleWrite from './component/coggle/CoggleWrite';
import Cokkiri from './component/recruit/Cokkiri';
import Mammoth from './component/recruit/Mammoth';
import MammothWrite from './component/recruit/MammothWrite';
import DirectMessengerButton from './component/DirectMessengerButton';
import MyPage from './component/mypage/MyPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <DirectMessengerButton/>
        <Routes>
              <Route exact path='/' element={<Main />} />
              <Route exact path='/techque' element={<Coggle />} />
              <Route exact path='/carrier' element={<Coggle />} />
              <Route exact path='/devlife' element={<Coggle />} />
              <Route exact path='/coggle-write' element={<CoggleWrite />} />
              <Route exact path='/cokkiri' element={<Cokkiri />} />
              <Route exact path='/mammoth' element={<Mammoth />} />
              <Route exact path='/mammoth-write' element={<MammothWrite />} />
              <Route exact path='/mypage' element={<MyPage />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
