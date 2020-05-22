export default {
  methods: {
    setDatabaseUser() {
      let userRef = this.$fireDb.ref("users/" + user.uid);

      userRef.once("value", snapshot => {
        let loggedinUser = {};
        if (snapshot.exists()) {
          loggedinUser = {
            id: user.uid,
            photoURL: snapshot.val().photoURL,
            displayName: snapshot.val().displayName,
            email: snapshot.val().email,
            biography: snapshot.val().biography,
            following: snapshot.val().following,
            followers: snapshot.val().followers
          };
        } else {
          let databaseUser = {
            displayName: user.displayName ? user.displayName : "User",
            photoURL: user.photoURL && user.photoURL,
            email: user.email
            // No more details available upon first login
          };
          userRef.set(databaseUser);

          loggedinUser = {
            id: user.uid,
            photoURL: user.photoURL && user.photoURL,
            displayName: user.displayName && user.displayName,
            email: user.email
            // No more details available upon first login
          };
        }
        this.$tore.dispatch("SET_USER", loggedinUser);
      });
    }
  }
};
