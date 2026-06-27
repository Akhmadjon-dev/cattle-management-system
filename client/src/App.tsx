import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CattleList from './pages/CattleList'
import CattleDetail from './pages/CattleDetail'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CattleList />} />
          <Route path="/cattle/:id" element={<CattleDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<div className="text-center py-8">Page not found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
