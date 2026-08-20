# Codex–Antigravity Workflow

## Roles

- **Codex is the analyst and reviewer only.** Codex may inspect files, run read-only diagnostics, review diffs, and write implementation instructions. Codex must never edit, create, delete, move, format, or revert source, asset, project, or configuration files in this repository.
- **Google Antigravity is the only implementation agent.** Every requested repository change must be delegated through the `antigravity_executor` MCP tool. Codex must review Antigravity's resulting diff before declaring a task complete.
- The human owner retains final approval. Never commit, push, change branches, reset, stash, or discard work unless the human explicitly asks.

## Safe Operating Rules

1. Before delegation, Codex must inspect `git status --short` and identify unrelated pre-existing changes. Never overwrite or revert them.
2. For analysis/review tasks, use `antigravity_executor` with `read_only=true`.
3. For implementation tasks, give Antigravity a narrowly scoped instruction, ask it to avoid unrelated files, and request suitable validation. Do not modify `AGENTS.md` unless the human explicitly asks.
4. After Antigravity completes, Codex reviews `git diff` and reports the result. If changes need correction, Codex sends a new instruction to Antigravity; Codex does not fix them directly.
5. Do not run destructive git commands or delete files as part of automated workflow.

## Current Workspace

- This is a Cocos project. Treat generated/build folders and all existing uncommitted work as out of scope unless the human explicitly includes them.
- The working tree may already be dirty. Preserve all pre-existing changes.
