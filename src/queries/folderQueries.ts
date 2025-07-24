import {
  fetchFolderContents,
  fetchFolderDetails,
} from '../services/googleDriveService';

export const folderQuery = (folderId: string | null) => ({
  // The queryKey uniquely identifies this query.
  // When folderId changes, TanStack Query knows it's a different query.
  queryKey: ['folders', folderId || 'root'],

  // The queryFn is the actual data-fetching function.
  queryFn: async () => {
    const [files, folderDetails] = await Promise.all([
      fetchFolderContents(folderId),
      folderId ? fetchFolderDetails(folderId) : null,
    ]);
    const parentId = folderDetails?.parents[0] || null;
    return { files, parentId };
  },
});
