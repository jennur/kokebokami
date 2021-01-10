import generatePath from "~/helpers/generatePath";
import userModel from "~/helpers/user-model";

export default function getUser(app, params) {
  let currentUser = app.$fire.auth.currentUser;

  if(currentUser && currentUser.uid) {
    app.$fire.database
      .ref("users")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          let userPath = `${params.key}/${params.userid}/`;
          let users = snapshot.val();

          for (let key in users) {
            let user = users[key];
            let path = generatePath(user.displayName, key, true);
            if (userPath === path) {
              this.cook = userModel(user, key);
            }
          }
        }
      })
  }
  return {
    id: null
  }
}
