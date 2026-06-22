## Which folder structure did you choose, and why — walk through "adding a feature" in both styles to justify it.

I chose the module based structure or function based structure over the layered one. The reasons were high cohesion and easier feature addition and easier boundaries over the cross-folder navigation overhead. With a tradeoff of duplication risk, global consistency control and centralized reuse

Lets say we need to add a feature, with modular design we create a separate folder for the new feature and develop all the related files in there easy to do.  
But for the case of layered structure we would have to create the feature's files across different folders.  

---

## Why keep TypeScript strict mode on — what does it catch, and when?

Keeping typescript strict mode on helps us catch the errors and problems during development through explicit type enforcement and null/any errors.

---

## What's the difference between how your app runs in development (dev) versus production (start)?

# Dev:
- runs TypeScript via tsx/ts-node
- no build step
- hot reload / watch mode

# Production:
- runs compiled JavaScript from dist
- no TypeScript runtime
- optimized, deterministic output 

---

## Why split app.ts from server.ts — what does it buy you in Chapter 30?

Spliting app.ts and server.ts helps us seperate logic and execution. With the help of this we can do testing easily by importing apps without listening. It also prevents port binding during tests, enables multiple server entry points (HTTP, testing, worker contexts) improves deployment flexibility  