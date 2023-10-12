import React from 'react';

import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Trading from './Components/Trading';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/' element={<Trading />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
