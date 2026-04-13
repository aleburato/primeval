# Releasing

This repository publishes one root npm package plus per-platform native packages.

Release automation is defined in [.github/workflows/quality.yml](.github/workflows/quality.yml) and [.github/workflows/napi-prebuilds.yml](.github/workflows/napi-prebuilds.yml).

## Before Tagging

Run from the repository root on a clean checkout:

```bash
npm ci
npm run verify
```

## Version Bump

Use the repository helper so `package.json`, `package-lock.json`, and platform package versions stay aligned with `napi.targets`:

```bash
npm run bump:version -- 0.1.2
```

Then review the resulting changes and rerun the package checks above.

## Release Flow

1. Commit the version bump.
2. Create an annotated tag in the form `v<version>`.
3. Push the commit and tag.

Example:

```bash
git commit -am "Release 0.1.2"
git tag -a v0.1.2 -m "v0.1.2"
git push origin main
git push origin v0.1.2
```

## What The Tag Workflow Does

When a `v*` tag is pushed, [.github/workflows/napi-prebuilds.yml](.github/workflows/napi-prebuilds.yml) will:

1. Re-run the shared quality workflow.
2. Derive the native target matrix from `package.json` `napi.targets`.
3. Build native addons for each supported target.
4. Assemble per-platform npm packages.
5. Verify that every expected package contains the correct `.node` payload.
6. Publish platform packages.
7. Publish the root npm package with provenance enabled.

## Dry Runs

To test the build side of the release workflow without publishing, use the workflow's `workflow_dispatch` trigger from GitHub Actions.

`workflow_dispatch` will run the build matrix, but the publish job only runs for tagged refs.

## After Publish

Verify:

- the root package version on npm
- the expected platform packages listed in `package.json` `optionalDependencies`
- install and runtime behavior on at least one supported machine
- the packaged CLI and one programmatic API path