import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeddingLanding from "./components/WeddingLanding";
import WishForm from "./components/WishForm";
import TemplateSelect from "./components/TemplateSelect"; // ✅ เพิ่มตรงนี้
import CardPreview from "./components/CardPreview";
import WishConfirm from "./components/WishConfirm";
import ThankYou from "./components/ThankYou"; // ✅ import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingLanding />} />
        <Route path="/wish" element={<WishForm />} />
        <Route path="/template" element={<TemplateSelect />} /> {/* ✅ เพิ่มเส้นทางเลือกเทมเพลต */}
        <Route path="/preview" element={<CardPreview />} />
        <Route path="/confirm" element={<WishConfirm />} />
        <Route path="/thankyou" element={<ThankYou />} /> {/* ✅ เพิ่มนี้ */}
      </Routes>
    </Router>
  );
}

export default App;
