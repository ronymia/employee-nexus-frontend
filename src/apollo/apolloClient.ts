"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import useAppStore from "@/stores/useAppStore";

const createApolloClient = () => {
  if (typeof window === "undefined") {
    // Return a minimal client for SSR — no token needed
    return new ApolloClient({
      ssrMode: true,
      link: new HttpLink({
        uri:
          process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
          "http://localhost:4000/graphql",
        headers: { "Content-Type": "application/json" },
      }),
      cache: new InMemoryCache(),
    });
  }

  const token = useAppStore.getState().token;

  return new ApolloClient({
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
        "http://localhost:4000/graphql",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
