"use client";

import appStore from "@/stores/appStore";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  const token = appStore((state) => state.token);

  if (typeof window === "undefined") {
    // Return a minimal client for SSR — no token needed
    return new ApolloClient({
      ssrMode: true,
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
  }

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
