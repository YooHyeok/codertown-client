import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/* 컴포넌트 */
import Header from './component/info/Header';
import Footer from './component/info/Footer';
import Main from './component/Main';
import CoggleList from './component/CoggleList';
import CokkiriList from './component/CokkiriList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <Routes>
              <Route exact path='/' element={<Main />} />
              <Route exact path='/techque' element={<CoggleList />} />
              <Route exact path='/carrier' element={<CoggleList />} />
              <Route exact path='/devlife' element={<CoggleList />} />
              <Route exact path='/cokkiri' element={<CokkiriList />} />
              <Route exact path='/mammoth' element={<CokkiriList />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
