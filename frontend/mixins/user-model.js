import generatePath from "../helpers/generatePath";

export default {
  methods: {
    userModel(user, key) {
      let hidden = user.hiddenProfile;

      return {
        id: key,
        title: user.displayName,
        displayName: user.displayName,
        photoURL: hidden ? "" : user.photoURL,
        biography: hidden ? "" : user.biography,
        notificationsOff: user.notificationsOff,
        path: hidden ? generatePath("anonymous-user", key) : generatePath(user.displayName, key)
      }
    },
  }
}
