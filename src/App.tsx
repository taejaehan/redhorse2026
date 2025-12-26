import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FortunePage from './pages/FortunePage';
import GroupPhotoPage from './pages/GroupPhotoPage';
import { ZodiacSign } from './types/fortune';
import { fortuneData } from './data/fortuneData';

function MainPageWrapper() {
  const navigate = useNavigate();

  const handleSelectZodiac = (sign: ZodiacSign) => {
    navigate(`/fortune/${sign}`);
  };

  return <MainPage onSelectZodiac={handleSelectZodiac} />;
}

function FortunePageWrapper() {
  const { sign } = useParams<{ sign: string }>();
  const navigate = useNavigate();

  const zodiacData = fortuneData.zodiacs.find((z) => z.sign === sign);

  const handleBack = () => {
    navigate('/');
  };

  if (!zodiacData) {
    // 잘못된 sign이면 메인으로
    navigate('/');
    return null;
  }

  return <FortunePage zodiac={zodiacData} onBack={handleBack} />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<MainPageWrapper />} />
          <Route path="/fortune/:sign" element={<FortunePageWrapper />} />
          <Route path="/group-photo" element={<GroupPhotoPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
