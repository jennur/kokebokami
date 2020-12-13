export default function generatePath(title, key, excludeQuery){
  let keySegment = key && key.replace(/[A-Z]/g, "").replace(/-/g, "").slice(0,5);
  let path = title && title.replace(/ /g, "-").replace(/&/g, "and").toLowerCase();

  path = encodeURIComponent(path);

  if(excludeQuery){
    return `${keySegment}/${path}/`;
  }

  return `${keySegment}/${path}?id=${key}`;
}
