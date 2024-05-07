import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import './index.css';
import './styles/root.css';
import './styles/customButton.css';
import Home from './components/Home/Home';
import Tokens from './components/Tokens/Tokens';
import DeployTokenContract from './components/Deploy/DeployTokenContract';
import TokenDetails from './components/Tokens/TokenDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/deploy" element={<DeployTokenContract />} />
        <Route path="/tokens/:id" element={<TokenDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
