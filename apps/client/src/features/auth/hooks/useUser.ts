import { UserBasic } from "@leet-code-clone/types";

export function useUser(): UserBasic | null {
  try {
    const stored = localStorage.getItem('userInfo');
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Type guard check (optional but helpful)
    if (typeof parsed === 'object' && parsed !== null && 'id' in parsed) {
      return parsed as UserBasic;
    }

    return null;
  } catch (err) {
    console.error('Failed to parse user from localStorage', err);
    return null;
  }
}
