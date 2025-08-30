import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
// import './index.css'
import App from "./App.tsx";

import { SetContextLink } from "@apollo/client/link/context";
import { UserProvider } from "./contexts/AuthContext.tsx";

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("issuesTrackerUser");
  console.log("main app:", token);

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <UserProvider>
        <App />
      </UserProvider>
    </ApolloProvider>
  </StrictMode>
);
