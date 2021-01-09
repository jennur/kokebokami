export default function generatePath(title, key){
  let keySegment = key && key.replace(/[A-Z]/g, "").replace(/-/g, "").slice(0,5);
  let path = title && title.replace(/ /g, "-").replace(/&/g, "and").toLowerCase();

  return `${keySegment}/${path}/`;
}
