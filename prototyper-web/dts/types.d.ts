declare module '*?blob' {
  const blobConstructor: {
    new (): Blob;
  };
  export default blobConstructor;
}
