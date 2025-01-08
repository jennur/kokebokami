import allCategories from "~/helpers/all-categories";
import { messageMutations } from "./mutations/message.mutations"
import { modalMutations } from "./mutations/modal.mutations";
import { recipeMutations } from "./mutations/recipe.mutations";
import { shoppingListMutations } from "./mutations/shopping-list.mutations"
import { userMutations } from "./mutations/user.mutations";

import { messageActions } from "./actions/message.actions"
import { modalActions } from "./actions/modal.actions";
import { recipeActions } from "./actions/recipe.actions";
import { shoppingListActions } from "./actions/shopping-list.actions"
import { userActions } from "./actions/user.actions";

export function state() {
  return {
    allCategories,
    loginModal: {
      open: false,
      headline: null
    },
    loginSystemMessage: "",
    showLoadingSplash: false,
    showUsernameModal: false,
    signupSystemMessage: "",
    shoppingListCount: 0,
    user: null
  };
}

export const mutations = {
  ...messageMutations,
  ...modalMutations,
  ...recipeMutations,
  ...shoppingListMutations,
  ...userMutations
};

export const actions = {
  ...messageActions,
  ...modalActions,
  ...recipeActions,
  ...shoppingListActions,
  ...userActions
};
