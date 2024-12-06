### Add this config to Docker Compose File
```dockerfile
CONTENT_SECURITY_POLICY_USE_DEFAULTS: true
CONTENT_SECURITY_POLICY_DIRECTIVES__SCRIPT_SRC: "'self','unsafe-eval',*.scaleflex.com"
CONTENT_SECURITY_POLICY_DIRECTIVES__IMG_SRC: "'self',data:,blob:,https://raw.githubusercontent.com,https://avatars.githubusercontent.com,*.filerobot.com"
```