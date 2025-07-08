import { describe, expect, it } from 'bun:test';
import { HttpResponse, http } from 'msw';
import { server } from '../../test/msw-setup';
import { fetchFolderContents, getAudioFileBlobUrl } from './googleDriveService';

describe('googleDriveService', () => {
  // MSW server setup is handled in test/test-setup.ts

  describe('fetchFolderContents', () => {
    it('fetches root folder contents successfully', async () => {
      const files = await fetchFolderContents(null);
      expect(files).toEqual([
        {
          id: 'folder-1',
          name: 'My Music',
          mimeType: 'application/vnd.google-apps.folder',
        },
        { id: 'audio-1', name: 'Song A.mp3', mimeType: 'audio/mpeg' },
      ]);
    });

    it('fetches specific folder contents successfully', async () => {
      const files = await fetchFolderContents('folder-1');
      expect(files).toEqual([
        { id: 'audio-2', name: 'Song B.wav', mimeType: 'audio/wav' },
      ]);
    });

    it('handles empty folder contents', async () => {
      // Override the default handler for this specific test
      server.use(
        http.get('https://www.googleapis.com/drive/v3/files', ({ request }) => {
          const url = new URL(request.url);
          const q = url.searchParams.get('q');
          if (q?.includes("'empty-folder' in parents")) {
            return HttpResponse.json({ files: [] });
          }
          return HttpResponse.error(); // Fallback to error if not the specific query
        }),
      );
      const files = await fetchFolderContents('empty-folder');
      expect(files).toEqual([]);
    });

    it('handles errors when fetching folder contents', async () => {
      // Override the default handler for this specific test
      server.use(
        http.get('https://www.googleapis.com/drive/v3/files', ({ request }) => {
          const url = new URL(request.url);
          const q = url.searchParams.get('q');
          if (q?.includes("'error-folder' in parents")) {
            return new HttpResponse(null, {
              status: 500,
              statusText: 'Internal Server Error',
            });
          }
          return HttpResponse.error(); // Fallback to error if not the specific query
        }),
      );
      await expect(fetchFolderContents('error-folder')).rejects.toThrow();
    });
  });

  describe('getAudioFileBlobUrl', () => {
    it('fetches audio file blob URL successfully', async () => {
      const blobUrl = await getAudioFileBlobUrl('audio-1');
      expect(blobUrl).toMatch(/^blob:/);
      // You might want to add more specific checks for the blob content if possible
      // For example, fetching the blob and checking its type or size
    });

    it('handles errors when fetching audio file blob', async () => {
      await expect(getAudioFileBlobUrl('error-audio')).rejects.toThrow();
    });
  });
});
