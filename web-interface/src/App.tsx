import React from 'react';
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import './App.css';
import './index.css';
import './styles/root.css';
import './styles/customButton.css';
import Home from './components/Home/Home';
import Tokens from './components/Tokens/Tokens';
import DeployTokenContract from './components/Deploy/DeployTokenContract';
import TokenDetails from './components/Tokens/TokenDetails';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Web3Provider } from './web3/Web3Context';

function App() {
  return (
    <Web3Provider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/deploy" element={<DeployTokenContract />} />
            <Route path="/tokens/:standard/:address" element={<TokenDetails />} />
          </Routes>
        </HashRouter>
    </Web3Provider>
  );
}

export default App;
