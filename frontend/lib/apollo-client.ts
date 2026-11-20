import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:4000/graphql',
});

/**
 * Apollo Client Configuration
 * Normalized GraphQL caching for HotelSphere (Marriott International)
 * Connects to GraphQL Yoga backend API
 */
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          hotels: {
            // Merge hotels list for pagination/filtering
            keyArgs: ['search', 'categoryIds', 'sort'],
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Hotel: {
        keyFields: ['id'],
      },
      Category: {
        keyFields: ['id'],
      },
      Booking: {
        keyFields: ['id'],
      },
    },
  }),
});
