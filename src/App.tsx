
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { HR } from './pages/HR';
import { Assets } from './pages/Assets';
import { Finance } from './pages/Finance';
import { Insights } from './pages/Insights';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="hr" element={<HR />} />
            <Route path="assets" element={<Assets />} />
            <Route path="finance" element={<Finance />} />
            <Route path="insights" element={<Insights />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
