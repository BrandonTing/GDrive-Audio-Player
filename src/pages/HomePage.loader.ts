import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { folderQuery } from '../queries/folderQueries';

// This is our "loader factory"
export const homePageLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const folderId = (params.folderId as string) || null;
    const query = folderQuery(folderId);

    try {
      // Use ensureQueryData to fetch data if it's not in the cache,
      // or return it from the cache if it already exists.
      return await queryClient.ensureQueryData(query);
    } catch (error) {
      console.error('Error in HomePage loader:', error);
      localStorage.removeItem('google_access_token');
      return redirect('/login');
    }
  };

