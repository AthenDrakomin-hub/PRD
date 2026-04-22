import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { CanvasEditor } from './pages/Editor';
import './index.css';

function App() {
  return (
    <ReactFlowProvider>
      <CanvasEditor />
    </ReactFlowProvider>
  );
}

export default App;
