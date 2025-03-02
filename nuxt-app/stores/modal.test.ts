import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useModalStore } from "./modal";


const classListMock = {
  add: vi.fn(),
  remove: vi.fn(),
  contains: vi.fn(),
};

Object.defineProperty(document.body, "classList", {
  value: classListMock,
  writable: true,
});


vi.mock("vue", async () => {
  const actual = await vi.importActual("vue");
  return {
    ...(actual as any),
    computed: vi.fn((fn) => {
      const result = { value: fn() };
      Object.defineProperty(result, "value", {
        get: fn,
      });
      return result;
    }),
  };
});

describe("useModalStore", () => {
  beforeEach(() => {

    setActivePinia(createPinia());


    vi.clearAllMocks();
  });

  it("initializes with empty recipeId and closed modal", () => {
    const store = useModalStore();
    expect(store.recipeId).toBe("");
    expect(store.isOpen).toStrictEqual({ value: false });
  });

  it("opens modal with specified recipe ID", () => {
    const store = useModalStore();
    store.openModal("123");

    expect(store.recipeId).toBe("123");
    expect(store.isOpen).toStrictEqual({ value: true });
    expect(classListMock.add).toHaveBeenCalledWith("modal-open");
  });

  it("closes modal", () => {
    const store = useModalStore();


    store.openModal("123");
    expect(store.isOpen).toStrictEqual({ value: true });


    store.closeModal();

    expect(store.recipeId).toBe("");
    expect(store.isOpen).toStrictEqual({ value: false });
    expect(classListMock.remove).toHaveBeenCalledWith("modal-open");
  });

  it("sets modal recipe ID directly", () => {
    const store = useModalStore();
    store.setModalRecipeId("456");

    expect(store.recipeId).toBe("456");
    expect(store.isOpen).toStrictEqual({ value: true });
    expect(classListMock.add).toHaveBeenCalledWith("modal-open");
  });

  it("sets modal recipe ID to empty string to close", () => {
    const store = useModalStore();

    store.setModalRecipeId("456");
    expect(store.isOpen).toStrictEqual({ value: true });


    store.setModalRecipeId("");

    expect(store.recipeId).toBe("");
    expect(store.isOpen).toStrictEqual({ value: false });
    expect(classListMock.remove).toHaveBeenCalledWith("modal-open");
  });

  it("sets modal recipe ID to undefined to close", () => {
    const store = useModalStore();


    store.setModalRecipeId("456");
    expect(store.isOpen).toStrictEqual({ value: true });


    store.setModalRecipeId(undefined as any);

    expect(store.recipeId).toBe("");
    expect(store.isOpen).toStrictEqual({ value: false });
    expect(classListMock.remove).toHaveBeenCalledWith("modal-open");
  });

  it("updates body class when opening modal", () => {
    const store = useModalStore();


    classListMock.add.mockClear();

    store.openModal("123");

    expect(classListMock.add).toHaveBeenCalledWith("modal-open");
    expect(classListMock.remove).not.toHaveBeenCalled();
  });

  it("updates body class when closing modal", () => {
    const store = useModalStore();


    store.openModal("123");

    classListMock.add.mockClear();
    classListMock.remove.mockClear();

    store.closeModal();

    expect(classListMock.remove).toHaveBeenCalledWith("modal-open");
    expect(classListMock.add).not.toHaveBeenCalled();
  });

  it("isOpen is reactive to recipeId changes", () => {
    const store = useModalStore();


    expect(store.isOpen).toStrictEqual({ value: false });


    store.recipeId = "123";
    expect(store.isOpen).toStrictEqual({ value: true });


    store.recipeId = "";
    expect(store.isOpen).toStrictEqual({ value: false });
  });

  it("handles multiple open/close cycles", () => {
    const store = useModalStore();


    store.openModal("123");
    expect(store.recipeId).toBe("123");
    expect(store.isOpen).toStrictEqual({ value: true });

    store.closeModal();
    expect(store.recipeId).toBe("");
    expect(store.isOpen).toStrictEqual({ value: false });


    store.openModal("456");
    expect(store.recipeId).toBe("456");
    expect(store.isOpen).toStrictEqual({ value: true });

    store.closeModal();
    expect(store.recipeId).toBe("");
    expect(store.isOpen).toStrictEqual({ value: false });
  });

  it("handles changing from one recipe to another without closing", () => {
    const store = useModalStore();


    store.openModal("123");
    expect(store.recipeId).toBe("123");
    expect(store.isOpen).toStrictEqual({ value: true });


    store.openModal("456");
    expect(store.recipeId).toBe("456");
    expect(store.isOpen).toStrictEqual({ value: true });

    expect(classListMock.add).toHaveBeenCalledTimes(2);
    expect(classListMock.add).toHaveBeenCalledWith("modal-open");
  });
});
