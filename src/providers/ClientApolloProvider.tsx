"use client";
import createApolloClient from "@/apollo/apolloClient";
import { ApolloProvider } from "@apollo/client/react";

export default function ClientApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = createApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
