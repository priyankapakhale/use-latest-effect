[![npm version](https://img.shields.io/npm/v/use-latest-effect.svg)](https://www.npmjs.com/package/use-latest-effect) [![Build Status](https://github.com/priyankapakhale/use-latest-effect/actions/workflows/ci.yml/badge.svg)](https://github.com/priyankapakhale/use-latest-effect/actions)

# use-latest-effect

> A tiny React hook to manage async effects safely solves race conditions and stale state updates, with abort support.

## ⚡️ Why use-latest-effect?

**Async logic in React’s `useEffect` often causes**:

- **Race conditions:** Old async calls overwrite new data.
- **Stale closures:** Effects run with outdated state/props.
- **No built-in abort:** You manually handle canceling fetches.

**use-latest-effect** solves all of this—**only your latest async effect can update state**, and stale runs are aborted automatically (optional).


## 🐞 Problem Example

```tsx
useEffect(() => {
  let active = true;
  fetchUser(userId).then((user) => {
    if (active) setUser(user); // can still race!
  });
  return () => { active = false; };
}, [userId]);
```

## 🧩 Installation

```bash
npm install use-latest-effect
# or
yarn add use-latest-effect
```

## 🚀 Quick Start

```tsx
import React, { useState } from "react";
import { useLatestEffect } from "use-latest-effect";

function App() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState<any>(null);

  useLatestEffect(
    async (isLatest, signal) => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        { signal }
      );
      const data = await res.json();
      if (isLatest()) setUser(data);
    },
    [userId]
  );

  return (
    <div>
      <button onClick={() => setUserId((id) => id + 1)}>Next User</button>
      {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : <p>Loading…</p>}
    </div>
  );
}
```

## 📦 API

| Argument  | Type                                                     | Default               | Description                                                                              |
| --------- | -------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `effect`  | `(isLatest: () => boolean, signal: AbortSignal) => void` | —                     | Your async effect; call `isLatest()` to drop stale runs, use `signal` to cancel fetches. |
| `deps`    | `DependencyList`                                         | —                     | React effect dependency array                                                            |
| `options` | `{ abortable?: boolean; cleanup?: () => void }`          | `{ abortable: true }` | Extra behavior: if `abortable` you’ll abort stale runs; `cleanup` runs on teardown.      |

## 🔧 Testing

This library ships with a comprehensive test suite using Jest and React Testing Library. To run tests locally:

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request for any bug reports or feature requests.

## 📄 License

Licensed under the MIT License.
