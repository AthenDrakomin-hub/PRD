import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CategoryDetail } from './pages/CategoryDetail';
import { TechTree } from './pages/TechTree';
import { Roadmap } from './pages/Roadmap';
import { MyLearning } from './pages/MyLearning';

function App() {
  return (
    <Router basename="/PRD">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:categoryId" element={<CategoryDetail />} />
          <Route path="tech-tree" element={<TechTree />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="my-learning" element={<MyLearning />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
