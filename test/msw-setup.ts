import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

// Define your handlers here
export const handlers = [
  // Example: Intercept GET requests to Google Drive files
  http.get('https://www.googleapis.com/drive/v3/files', () => {
    return HttpResponse.json({
      files: [
        { id: 'mock-file-1', name: 'Mock Song 1.mp3', mimeType: 'audio/mpeg' },
        { id: 'mock-file-2', name: 'Mock Song 2.wav', mimeType: 'audio/wav' },
      ],
    });
  }),
];

export const server = setupServer(...handlers);
