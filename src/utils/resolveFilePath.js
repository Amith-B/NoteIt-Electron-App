/* global path */
export default function getFilePath(relativeUrl) {
  return path.getFilePath(`/build/${relativeUrl}`);
}
