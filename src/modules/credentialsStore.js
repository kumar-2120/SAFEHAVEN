const STORAGE_KEY = "safehaven.credentials.v1";
const FIXED_ADMIN = {
  id: "admin-fixed",
  username: "KUMAR_1916",
  name: "Kumar",
  role: "admin",
  passwordHash: "109ac23e62e30df2a942241f2c67c4270236023f2417c2a5f6b4ee120a59d710",
  passwordPreview: "",
  createdAt: "2026-02-24T00:00:00.000Z",
};

const withFixedAdmin = (users) => {
  const existingAdmin = users.find(
    (user) => user?.username?.toLowerCase() === FIXED_ADMIN.username.toLowerCase()
  );
  const mergedAdmin = existingAdmin
    ? {
        ...FIXED_ADMIN,
        ...existingAdmin,
        role: "admin",
      }
    : FIXED_ADMIN;

  const filteredUsers = users.filter(
    (user) => user?.username?.toLowerCase() !== FIXED_ADMIN.username.toLowerCase()
  );
  return [mergedAdmin, ...filteredUsers];
};

const toHex = (buffer) => Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");

const fallbackHash = (input) => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return `legacy-${Math.abs(hash)}`;
};

export const hashPassword = async (plainPassword) => {
  const cryptoApi = window.crypto?.subtle;
  if (!cryptoApi) {
    return fallbackHash(plainPassword);
  }
  const encoded = new TextEncoder().encode(plainPassword);
  const digest = await cryptoApi.digest("SHA-256", encoded);
  return toHex(digest);
};

export const getStoredCredentials = () => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = withFixedAdmin([]);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw);
    const users = Array.isArray(parsed) ? parsed : [];
    const withAdmin = withFixedAdmin(users);
    if (JSON.stringify(users) !== JSON.stringify(withAdmin)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(withAdmin));
    }
    return withAdmin;
  } catch {
    const seeded = withFixedAdmin([]);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

export const saveStoredCredentials = (users) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const getAllUsers = () => getStoredCredentials();

export const findUserByUsername = (username) => {
  const normalizedUsername = username.trim().toLowerCase();
  return getStoredCredentials().find((user) => user.username.toLowerCase() === normalizedUsername) || null;
};

export const createUserCredential = async ({ username, password, name, role }) => {
  const users = getStoredCredentials();
  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername) {
    throw new Error("Username is required.");
  }
  const exists = users.some((user) => user.username.toLowerCase() === normalizedUsername);
  if (exists) {
    throw new Error("Username already exists. Please login.");
  }

  const passwordHash = await hashPassword(password);
  const user = {
    id: Date.now(),
    username: normalizedUsername,
    name: name.trim() || normalizedUsername,
    role,
    passwordHash,
    passwordPreview: password,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, user];
  saveStoredCredentials(updatedUsers);
  return user;
};

export const verifyUserCredential = async ({ username, password }) => {
  const user = findUserByUsername(username);
  if (!user) return null;

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) return null;

  return user;
};

export const updateUserCredentialPassword = async ({ username, newPassword }) => {
  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername) {
    throw new Error("Username is required.");
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const users = getStoredCredentials();
  const index = users.findIndex((user) => user.username.toLowerCase() === normalizedUsername);
  if (index === -1) {
    throw new Error("User not found.");
  }

  const passwordHash = await hashPassword(newPassword);
  const updatedUser = {
    ...users[index],
    passwordHash,
    passwordPreview: newPassword,
  };

  const updatedUsers = [...users];
  updatedUsers[index] = updatedUser;
  saveStoredCredentials(updatedUsers);
  return updatedUser;
};
