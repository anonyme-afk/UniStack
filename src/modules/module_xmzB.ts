// Ambient declarations for modules that may be installed at runtime but are not
// required for the core library.  Placing them in a declaration file avoids
// "cannot find module" errors during build when the packages are absent.

declare module 'chokidar' {
  const value: any;
  export default value;
}

declare module 'ws' {
  const value: any;
  export default value;
}

declare module 'node-fetch' {
  const value: any;
  export default value;
}
