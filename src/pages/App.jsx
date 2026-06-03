import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import { MobileHeader, MobileBottomNav } from './components/MobileNav';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdmissionPredictor from './pages/AdmissionPredictor';
import CollegeFinder from './pages/CollegeFinder';
import AIChatbot from './pages/AIChatbot';
import { CareerGuidance, CourseRecommender, PerformanceAnalytics } from './pages/OtherPages';
import { ResumeBuilder, ScholarshipFinder, StudyPlanner, AdminPanel } from './pages/MorePages';

function AppShell() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!user) return <AuthPage />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':   return <Dashboard onNavigate={setPage} />;
      case 'predict':     return <AdmissionPredictor />;
      case 'colleges':    return <CollegeFinder />;
      case 'chatbot':     return <AIChatbot />;
      case 'career':      return <CareerGuidance onNavigate={setPage} />;
      case 'courses':     return <CourseRecommender />;
      case 'analytics':   return <PerformanceAnalytics />;
      case 'resume':      return <ResumeBuilder />;
      case 'scholarship': return <ScholarshipFinder />;
      case 'planner':     return <StudyPlanner />;
      case 'admin':       return <AdminPanel />;
      default:            return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <Sidebar active={page} onNavigate={setPage} />

      {/* Main */}
      <main className="main-content">
        {/* Mobile Header */}
        <MobileHeader />

        {renderPage()}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav active={page} onNavigate={setPage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
