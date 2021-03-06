import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";

const root = ReactDOM.createRoot(document.getElementById("root"));
const client = new ApolloClient({
  uri: "https://api.spacex.land/graphql/",
  cache: new InMemoryCache(),
});
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
      <Navbar />
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
