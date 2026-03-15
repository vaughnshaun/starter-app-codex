Skip workspace approvals
```sh
codex -a never -s workspace-write "Your prompt here"
```

Full Access
```sh
codex --dangerously-bypass-approvals-and-sandbox "Your prompt here"
```

toml config
```toml
approval_policy = "never"
sandbox_mode = "danger-full-access" # Optional: use "workspace-write" for safer access
```