import type { Metadata } from 'next';

import { Todos } from './ui/todos/Todos';

export default function IndexPage() {
  return <Todos />;
}

export const metadata: Metadata = {
  title: 'RTK Query - GraphQL CRUD',
};
