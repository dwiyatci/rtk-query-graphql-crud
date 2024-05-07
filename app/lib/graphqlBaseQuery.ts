import { ClientError, Variables, request } from 'graphql-request';

export const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({ query, variables }: { query: string; variables?: Variables }) => {
    try {
      const result = await request(baseUrl, query, variables);
      return { data: result };
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, data: error } };
      }
      return { error: { status: 500, data: error } };
    }
  };
