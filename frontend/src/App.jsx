import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeddingLanding from "./components/WeddingLanding";
import WishForm from "./components/WishForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingLanding />} />
        <Route path="/wish" element={<WishForm />} />
      </Routes>
    </Router>
  );
}

export default App;
