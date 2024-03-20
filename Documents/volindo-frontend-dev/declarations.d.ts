declare module 'file-saver' {
  const saveAs: (
    data: Blob,
    filename?: string,
    disableAutoBOM?: boolean
  ) => void;
  export default saveAs;
}
declare module 'numeral';
