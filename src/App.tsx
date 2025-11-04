import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import IndexPage from './pages/Index';
import CustomPage from './pages/Custom';

function App() {
  return (
    <BrowserRouter>
      <h1>SSE Practice</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to='/single'>/single (onmessage)</Link>
        <Link to='/custom'>/custom (addEventListener)</Link>
      </nav>
      <hr />
      <Routes>
        <Route path='/single' element={<IndexPage />} />
        <Route path='/custom' element={<CustomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
