import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * store for managing modal state across the application
 */
export const useModalStore = defineStore("modal", () => {
  const recipeId = ref("");
  const isOpen = computed(() => Boolean(recipeId.value));
  
  /**
   * sets the recipe ID for the modal and updates the document body class
   * @param newRecipeId - ID of the recipe to display in modal, or empty string to close
   */
  const setModalRecipeId = (newRecipeId: string = "") => {
    recipeId.value = newRecipeId;
    updateBodyClass();
  };
  
  /**
   * opens the modal with the specified recipe
   * @param id - the ID of the recipe to display
   */
  const openModal = (id: string) => {
    setModalRecipeId(id);
  };
  
  const closeModal = () => {
    setModalRecipeId("");
  };
  
  /**
   * Updates the document body class based on modal state in order to block body scroll when the modal is open
   */
  const updateBodyClass = () => {
    if (isOpen.value) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  };

  return { 
    // state
    recipeId,
    isOpen,
    
    // actions
    setModalRecipeId,
    openModal,
    closeModal
  };
});
