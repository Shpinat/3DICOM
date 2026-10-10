import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MprPage from './pages/MprPage';
import ThreeDPage from './pages/ThreeDPage';

const App: React.FC = () => {
  return (
    <Router basename="/dicom-viewer">
      <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
        <header className="bg-gray-800 p-4 shadow-md flex gap-4 items-center">
          <h1 className="text-xl font-bold">DICOM Просмотрщик</h1>
          <nav className="flex gap-4 ml-8">
            <Link to="/" className="hover:text-blue-400">2D Просмотр</Link>
            <Link to="/mpr" className="hover:text-blue-400">MPR</Link>
            <Link to="/3d" className="hover:text-blue-400">3D Рендер</Link>
          </nav>
        </header>
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mpr" element={<MprPage />} />
            <Route path="/3d" element={<ThreeDPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
