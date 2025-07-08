import { afterEach, describe, expect, it } from 'bun:test';
import { HttpResponse, http } from 'msw';
import { server } from '../../test/msw-setup';
import { homePageLoader } from './HomePage.loader';

describe('homePageLoader', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should return file data on successful fetch', async () => {
    const mockFiles = [{ id: '1', name: 'file1.mp3' }];
    server.use(
      http.get('https://www.googleapis.com/drive/v3/files', () => {
        return HttpResponse.json({ files: mockFiles });
      }),
    );

    const response = await homePageLoader({ params: {} } as any);
    const data = await (response as {
      files: {
        id: string;
        name: string;
      }[];
    }).files;

    expect(data).toEqual(mockFiles);
  });

  it('should redirect to /login on fetch error', async () => {
    server.use(
      http.get('https://www.googleapis.com/drive/v3/files', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const response = await homePageLoader({ params: {} } as any);

    expect(response instanceof Response).toBe(true);
    if (response instanceof Response) {
      expect(response.headers.get('Location')).toBe('/login');
    }
  });
});
