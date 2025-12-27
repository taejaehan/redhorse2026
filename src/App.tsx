import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FortunePage from './pages/FortunePage';
import GroupPhotoPage from './pages/GroupPhotoPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ZodiacSign } from './types/fortune';
import { fortuneData } from './data/fortuneData';

function MainPageWrapper() {
  const navigate = useNavigate();
  const { basePath } = useLanguage();

  const handleSelectZodiac = (sign: ZodiacSign) => {
    navigate(`${basePath}/fortune/${sign}`);
  };

  return <MainPage onSelectZodiac={handleSelectZodiac} />;
}

function FortunePageWrapper() {
  const { sign } = useParams<{ sign: string }>();
  const navigate = useNavigate();
  const { basePath } = useLanguage();

  const zodiacData = fortuneData.zodiacs.find((z) => z.sign === sign);

  const handleBack = () => {
    navigate(basePath || '/');
  };

  if (!zodiacData) {
    navigate(basePath || '/');
    return null;
  }

  return <FortunePage zodiac={zodiacData} onBack={handleBack} />;
}

function AppRoutes() {
  return (
    <LanguageProvider>
      <div className="app">
        <Routes>
          {/* Korean routes */}
          <Route path="/" element={<MainPageWrapper />} />
          <Route path="/fortune/:sign" element={<FortunePageWrapper />} />
          <Route path="/group-photo" element={<GroupPhotoPage />} />

          {/* English routes */}
          <Route path="/en" element={<MainPageWrapper />} />
          <Route path="/en/fortune/:sign" element={<FortunePageWrapper />} />
          <Route path="/en/group-photo" element={<GroupPhotoPage />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
