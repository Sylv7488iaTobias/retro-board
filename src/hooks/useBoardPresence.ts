import { useState, useEffect, useCallback } from 'react';

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
  joinedAt: number;
}

const PRESENCE_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
];

function generateUserId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function pickColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return PRESENCE_COLORS[hash % PRESENCE_COLORS.length];
}

export interface UseBoardPresenceResult {
  currentUser: PresenceUser;
  activeUsers: PresenceUser[];
  updateName: (name: string) => void;
}

export function useBoardPresence(
  boardId: string,
  initialName = 'Anonymous'
): UseBoardPresenceResult {
  const [currentUser] = useState<PresenceUser>(() => {
    const id = generateUserId();
    return { id, name: initialName, color: pickColor(id), joinedAt: Date.now() };
  });

  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([currentUser]);
  const [name, setName] = useState(initialName);

  const storageKey = `presence:${boardId}`;

  const writePresence = useCallback(
    (user: PresenceUser) => {
      try {
        const raw = localStorage.getItem(storageKey);
        const users: PresenceUser[] = raw ? JSON.parse(raw) : [];
        const filtered = users.filter((u) => u.id !== user.id);
        filtered.push(user);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
      } catch {
        // ignore storage errors
      }
    },
    [storageKey]
  );

  const readPresence = useCallback((): PresenceUser[] => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const users: PresenceUser[] = JSON.parse(raw);
      const cutoff = Date.now() - 30_000;
      return users.filter((u) => u.joinedAt >= cutoff);
    } catch {
      return [];
    }
  }, [storageKey]);

  useEffect(() => {
    const updated = { ...currentUser, name, joinedAt: Date.now() };
    writePresence(updated);
    setActiveUsers(readPresence());

    const interval = setInterval(() => {
      writePresence({ ...currentUser, name, joinedAt: Date.now() });
      setActiveUsers(readPresence());
    }, 10_000);

    return () => {
      clearInterval(interval);
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const users: PresenceUser[] = JSON.parse(raw);
          localStorage.setItem(
            storageKey,
            JSON.stringify(users.filter((u) => u.id !== currentUser.id))
          );
        }
      } catch {
        // ignore
      }
    };
  }, [boardId, name]);

  const updateName = useCallback((newName: string) => {
    setName(newName);
  }, []);

  return { currentUser: { ...currentUser, name }, activeUsers, updateName };
}
