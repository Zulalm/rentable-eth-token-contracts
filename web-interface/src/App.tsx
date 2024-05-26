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

import Web3 from 'web3';
import { Web3Provider } from './web3/Web3Context';
import { TokenProvider } from './components/Providers/TokenProvider';

function App() {
  return (
    <Web3Provider>
      <TokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/deploy" element={<DeployTokenContract />} />
            <Route path="/tokens/:address" element={<TokenDetails />} />
          </Routes>
        </BrowserRouter>
      </TokenProvider>
    </Web3Provider>
  );
}

export default App;
