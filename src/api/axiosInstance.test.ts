import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { HttpResponse, http } from 'msw';
import { server } from '../../test/msw-setup';
import axiosInstance from './axiosInstance';

describe('axiosInstance interceptors', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    server.resetHandlers();
  });

  it('should add the Authorization header if access token exists in localStorage', async () => {
    const accessToken = 'test-access-token';
    localStorage.setItem('google_access_token', accessToken);

    let requestHeaders: Headers | undefined;
    server.use(
      http.get('https://www.googleapis.com/drive/v3/files', ({ request }) => {
        requestHeaders = request.headers;
        return HttpResponse.json({ files: [] });
      }),
    );

    await axiosInstance.get('/files');

    expect(requestHeaders?.get('Authorization')).toBe(`Bearer ${accessToken}`);
  });

  it('should not add the Authorization header if access token does not exist in localStorage', async () => {
    let requestHeaders: Headers | undefined;
    server.use(
      http.get('https://www.googleapis.com/drive/v3/files', ({ request }) => {
        requestHeaders = request.headers;
        return HttpResponse.json({ files: [] });
      }),
    );

    await axiosInstance.get('/files');
    expect(requestHeaders?.get('Authorization')).toBeNull();
  });
});
