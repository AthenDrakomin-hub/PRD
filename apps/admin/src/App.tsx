import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CanvasEditor } from './pages/Editor';
import { LiveDashboard } from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="fixed top-0 inset-x-0 h-14 bg-dark-card border-b border-dark-border z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="KForge Logo" className="h-6" />
        </div>
        <div className="flex gap-4">
          <Link to="/" className="text-gray-400 hover:text-white text-sm font-medium">插件编排工作台</Link>
          <Link to="/live" className="text-cyber-accent hover:text-white text-sm font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> 态势感知大屏
          </Link>
        </div>
      </div>
      
      <div className="pt-14 h-screen">
        <Routes>
          <Route path="/" element={
            <ReactFlowProvider>
              <CanvasEditor />
            </ReactFlowProvider>
          } />
          <Route path="/live" element={<LiveDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
