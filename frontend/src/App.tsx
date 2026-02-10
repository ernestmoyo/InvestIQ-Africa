import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import PredictiveAnalytics from './pages/PredictiveAnalytics';
import ImpactCalculator from './pages/ImpactCalculator';
import InvestmentMatching from './pages/InvestmentMatching';
import Investments from './pages/Investments';
import SectorAnalysis from './pages/SectorAnalysis';
import Reports from './pages/Reports';

function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<PredictiveAnalytics />} />
          <Route path="/impact-calculator" element={<ImpactCalculator />} />
          <Route path="/matching" element={<InvestmentMatching />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/sector-analysis" element={<SectorAnalysis />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
