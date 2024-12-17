import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cube from './components/Cube'; // 立方体コンポーネント
import ModelViewer from './components/ModelViewer'; // glTFモデル表示コンポーネント
import ModelViewer2 from './components/ModelViewer2';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/cube">Cube</Link> {/* 立方体のページへのリンク */}
            </li>
            <li>
              <Link to="/model">Millennium Falcon</Link> {/* glTFモデルのページへのリンク */}
            </li>
            <li>
              <Link to="/model2">Delorian and Subaru</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/cube" element={<Cube />} /> {/* 立方体のルート */}
          <Route path="/model" element={<ModelViewer />} /> {/* glTFモデルのルート */}
          <Route path="/model2" element={<ModelViewer2 />} />
        </Routes>
      </div>
    </Router>


  );
}

export default App;
