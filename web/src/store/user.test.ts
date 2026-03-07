import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useUserStore } from "./user";

describe("useUserStore", () => {
  beforeEach(() => {
    act(() => {
      useUserStore.getState().clearUser();
    });
  });

  it("should have initial state correctly", () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("should set user and authentication status", () => {
    const mockUser = {
      _id: "u1",
      email: "test@example.com",
      role: "member",
      profile: { firstName: "Test", lastName: "User" },
    } as any;

    act(() => {
      useUserStore.getState().setUser(mockUser);
    });

    const state = useUserStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should update user profile", () => {
    const mockUser = {
      _id: "u1",
      profile: { firstName: "Test", lastName: "User" },
    } as any;

    act(() => {
      useUserStore.getState().setUser(mockUser);
      useUserStore.getState().updateProfile({ firstName: "Updated" });
    });

    const state = useUserStore.getState();
    expect(state.user?.profile.firstName).toBe("Updated");
    expect(state.user?.profile.lastName).toBe("User");
  });

  it("should clear user on logout", () => {
    act(() => {
      useUserStore.getState().setUser({ _id: "u1" } as any);
      useUserStore.getState().clearUser();
    });

    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should correctly identify roles", () => {
    act(() => {
      useUserStore.getState().setUser({ role: "owner" } as any);
    });

    const state = useUserStore.getState();
    expect(state.isOwnerOrManager()).toBe(true);
    expect(state.isMember()).toBe(false);

    act(() => {
      useUserStore.getState().setUser({ role: "member" } as any);
    });

    expect(useUserStore.getState().isMember()).toBe(true);
    expect(useUserStore.getState().isOwnerOrManager()).toBe(false);
  });
});
