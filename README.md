# use-latest-effect

> A React hook that runs async effects but only keeps the latest invocation (with optional abort of stale runs).

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
