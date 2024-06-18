import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { routePrivate } from './routes/route';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {routePrivate.map((route, index) => {
            const Page = route.component;
            return (
              <Route key={index} path={route.path} element={<Page />} />
            );
          })}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
