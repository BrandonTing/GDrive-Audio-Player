declare namespace gapi {
  namespace client {
    namespace drive {
      namespace files {
        function get(params: { fileId: string; alt?: string }): Promise<string>;
      }
    }
  }
}
