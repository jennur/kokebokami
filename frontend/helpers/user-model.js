import generatePath from "./generatePath";

export default function userModel(user, key) {
  let hidden = user.hiddenProfile;

  return {
    hidden,
    id: key,
    title: user.displayName,
    displayName: user.displayName,
    photoURL: hidden ? "" : user.photoURL,
    biography: hidden ? "" : user.biography,
    notificationsOff: user.notificationsOff,
    path: hidden ? generatePath("anonymous-user", key) : generatePath(user.displayName, key)
  }
}
