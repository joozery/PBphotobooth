import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import WeddingLanding from "./components/WeddingLanding";
import WishForm from "./components/WishForm";
import TemplateSelect from "./components/TemplateSelect";
import CardPreview from "./components/CardPreview";
import WishConfirm from "./components/WishConfirm";
import ThankYou from "./components/ThankYou";
import Dashboard from "./components/Dashboard/Dashboard";
import EventDetail from "./components/EventDetail";
import AdminLogin from "./components/AdminLogin";
import CreateEvent from "./components/Dashboard/pages/CreateEvent";
import TemplateBuilder from "./components/Dashboard/pages/TemplateBuilder"; // ✅ เพิ่มตรงนี้
import UploadSlipForm from "./components/UploadSlipForm";
import WishGallerySlideshow from "./components/WishGallerySlideshow";

function App() {
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <Routes>
        <Route path="/" element={<WeddingLanding />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/event/:eventId/edit" element={<CreateEvent />} />
        <Route path="/wish/:eventId" element={<WishForm />} />
        <Route path="/preview" element={<CardPreview />} />
        <Route path="/confirm" element={<WishConfirm />} />
        <Route path="/thankyou/:eventId" element={<ThankYou />} /> {/* ✅ แก้ตรงนี้ */}
        <Route path="/template/:eventId" element={<TemplateSelect />} />
        <Route path="/select-template/:eventId" element={<TemplateSelect />} />
        <Route path="/upload-slip" element={<UploadSlipForm />} />
        <Route path="/wish-gallery" element={<WishGallerySlideshow />} />

        {/* ✅ เส้นทางแอดมิน */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ เส้นทางแก้ไขเทมเพลต */}
        <Route path="/dashboard/edit-template/:id" element={<TemplateBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;