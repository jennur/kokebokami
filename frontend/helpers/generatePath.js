export default function generatePath(title, key){
  let keySegment = key && key.replace(/[A-Z]/g, "").replace(/-/g, "").slice(0,5);
  let path = "";

  if(title) {
    path = title.replace(/ /g, "-")
                .replace(/&/g, "and")
                .replace(/\//g, "-")
                .toLowerCase();
  }
  return `${keySegment}/${path}/`;
}
