import React from "react";
import ReactDOM from "react-dom/client"; // Update this import
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./redux/store.js"; // make sure to import your store

const queryClient = new QueryClient();

// Get the root element
const container = document.getElementById("root");

// Create a root
const root = ReactDOM.createRoot(container);

// Render the app using the new API
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
