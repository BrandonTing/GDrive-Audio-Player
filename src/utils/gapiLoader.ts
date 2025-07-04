
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

let gapiLoaded = false;

export const loadGapi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (gapiLoaded) {
      resolve();
      return;
    }

    gapi.load(
      'client:auth2',
      () => {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        }).then(() => {
          return gapi.client.load('drive', 'v3');
        }).then(() => {
          gapiLoaded = true;
          resolve();
        }).catch(error => {
          console.error("Error initializing gapi client:", error);
          reject(error);
        });
      },
    );
  });
};
