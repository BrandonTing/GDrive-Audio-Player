import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  // Handler for fetching folder contents
  http.get('https://www.googleapis.com/drive/v3/files', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');

    if (q?.includes("'root' in parents")) {
      return HttpResponse.json({
        files: [
          {
            id: 'folder-1',
            name: 'My Music',
            mimeType: 'application/vnd.google-apps.folder',
          },
          { id: 'audio-1', name: 'Song A.mp3', mimeType: 'audio/mpeg' },
        ],
      });
    } else if (q?.includes("'folder-1' in parents")) {
      return HttpResponse.json({
        files: [{ id: 'audio-2', name: 'Song B.wav', mimeType: 'audio/wav' }],
      });
    } else if (q?.includes("error-folder' in parents")) {
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }

    return HttpResponse.json({ files: [] }); // Default empty response
  }),

  // Handler for fetching audio file blob
  http.get(
    'https://www.googleapis.com/drive/v3/files/:fileId',
    ({ params, request }) => {
      const { fileId } = params;
      const url = new URL(request.url);
      const alt = url.searchParams.get('alt');

      if (alt === 'media') {
        if (fileId === 'audio-1') {
          return new HttpResponse('mock audio data for song A', {
            headers: { 'Content-Type': 'audio/mpeg' },
          });
        } else if (fileId === 'audio-2') {
          return new HttpResponse('mock audio data for song B', {
            headers: { 'Content-Type': 'audio/wav' },
          });
        } else if (fileId === 'error-audio') {
          return new HttpResponse(null, {
            status: 404,
            statusText: 'Not Found',
          });
        }
      }

      return new HttpResponse(null, { status: 400, statusText: 'Bad Request' });
    },
  ),
];

export const server = setupServer(...handlers);
