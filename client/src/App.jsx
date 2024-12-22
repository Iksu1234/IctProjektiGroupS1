import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Electricitypage from "./pages/Electricitypage";
import Reportspage from "./pages/Reportspage";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/electricity" element={<Electricitypage />} />
        <Route path="/reports" element={<Reportspage />} />
      </Routes>
    </Router>
  );
}

export default App;
