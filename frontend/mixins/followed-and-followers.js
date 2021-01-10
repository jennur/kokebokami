import userModel from "../helpers/user-model";

export default {
  data() {
    return {
      followed: [],
      followers: [],
    }
  },
  methods: {
    getFollowersAndFollowed(){
      let currentUser = this.$store.state.user;
      if (currentUser) {
        try {
          this.$fire.database
          .ref("users")
          .once("value", snapshot => {
            if (snapshot.exists()) {
              let users = snapshot.val();

              for(let key in users) {
                let user = users[key];
                  //If followed ...
                  if(user.following) {
                    if(Object.values(user.following).indexOf(currentUser.id) > -1) {
                      this.followers.push(userModel(user, key))
                    }
                  }
                  //If following ...
                  if(currentUser.following){
                    if(Object.values(currentUser.following).indexOf(key) > -1) {
                      this.followed.push(userModel(user, key))
                    }
                  }
              }
            }
          });
        }
        catch (error) {
          console.log("Error getting users:", error.message);
          this.errorMessage = "Unable to load users. If the issue continues, please contact us.";
        }
      }
    }
  },
  mounted() {
    this.getFollowersAndFollowed();
  },
};
