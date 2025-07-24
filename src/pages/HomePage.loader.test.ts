import { afterEach, describe, expect, it } from 'bun:test';
import { HttpResponse, http } from 'msw';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { server } from '../../test/msw-setup';
import { homePageLoader } from './HomePage.loader';
import { QueryClient } from '@tanstack/react-query';

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
    const queryClient = new QueryClient();
    const response = await homePageLoader(queryClient)({ params: {} } as LoaderFunctionArgs);
    const data = (
      response as {
        files: {
          id: string;
          name: string;
        }[];
      }
    ).files;
    expect(data).toEqual(mockFiles);
  });

  it('should redirect to /login on fetch error', async () => {
    server.use(
      http.get('https://www.googleapis.com/drive/v3/files', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const queryClient = new QueryClient();
    const response = await homePageLoader(queryClient)({ params: {} } as LoaderFunctionArgs);

    expect(response instanceof Response).toBe(true);
    if (response instanceof Response) {
      expect(response.headers.get('Location')).toBe('/login');
    }
  });
});
