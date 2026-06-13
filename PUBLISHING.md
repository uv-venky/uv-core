# Publishing uv-core for stitchmate (and other apps)

Consumers install with:

```json
"uv-core": "github:uv-venky/uv-core#v1.0.1"
```

## Required files in the GitHub repo

These must be committed (v1.0.0 was missing `src/` and `tsconfig.json`):

- `src/**` — TypeScript source
- `tsconfig.json`
- `dist/**` — compiled output (recommended; avoids build on install)
- `config/`, `migrations/`, `scripts/`
- `package.json`

## Release steps

```bash
cd uv-core
npm install
npm run build
git add src dist tsconfig.json config migrations scripts package.json README.md
git commit -m "Include full package for GitHub installs"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

Then in stitchmate:

```json
"uv-core": "github:uv-venky/uv-core#v1.0.1"
```

```bash
cd stitchmate
pnpm install
```
