import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Visualization from "./pages/Visualization";
import Chatbot from "./pages/Chatbot";
import WorkOrders from "./pages/WorkOrders";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home></Home>} />
                <Route
                    path="/visualization"
                    element={<Visualization></Visualization>}
                />
                <Route path="/chatbot" element={<Chatbot></Chatbot>} />
                <Route path="/workorder" element={<WorkOrders></WorkOrders>} />
            </Routes>
        </Router>
    );
}

export default App;
