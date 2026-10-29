import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LearnPage } from './pages/LearnPage';
import { LessonDetailPage } from './pages/LessonDetailPage';
import { VirtualLabPage } from './pages/VirtualLabPage';
import { AiTutorPage } from './pages/AiTutorPage';
import { CodingArenaPage } from './pages/CodingArenaPage';
import { QuizZonePage } from './pages/QuizZonePage';
import { IotSimulationsPage } from './pages/IotSimulationsPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="learn/:lessonId" element={<LessonDetailPage />} />
            <Route path="lab" element={<VirtualLabPage />} />
            <Route path="ai-tutor" element={<AiTutorPage />} />
            <Route path="coding" element={<CodingArenaPage />} />
            <Route path="quizzes" element={<QuizZonePage />} />
            <Route path="iot" element={<IotSimulationsPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
