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
    const files = await fetchFolderContents(folderId);

    if (folderId) {
      const folderDetails = await fetchFolderDetails(folderId);
      const parentId = folderDetails.parents ? folderDetails.parents[0] : null;
      return { files, parentId };
    }

    return { files, parentId: null };
  },
});
