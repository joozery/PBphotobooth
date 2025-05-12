import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeddingLanding from "./components/WeddingLanding";
import WishForm from "./components/WishForm";
import TemplateSelect from "./components/TemplateSelect";
import CardPreview from "./components/CardPreview";
import WishConfirm from "./components/WishConfirm";
import ThankYou from "./components/ThankYou";
import Dashboard from "./components/Dashboard/Dashboard";
import EventDetail from "./components/EventDetail";
import AdminLogin from "./components/AdminLogin"; // ✅ เพิ่มหน้า Login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingLanding />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/wish" element={<WishForm />} />
        <Route path="/template" element={<TemplateSelect />} />
        <Route path="/preview" element={<CardPreview />} />
        <Route path="/confirm" element={<WishConfirm />} />
        <Route path="/thankyou" element={<ThankYou />} />

        {/* ✅ เส้นทางแอดมิน */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
