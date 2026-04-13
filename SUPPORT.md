# Support Policy

## Where To Ask

- Bug reports and reproducible regressions: open a GitHub issue.
- Feature requests and behavior discussions: open a GitHub issue.
- Security issues: report privately as described in [SECURITY.md](SECURITY.md).

When filing an issue, include the package version, operating system, architecture, Node version, input format, and a minimal reproduction when possible.

## Versioning

`primeval` uses versioned releases for the npm package and Rust workspace, but the project is currently in the `0.x` stage.

That means:

- patch releases are expected to contain fixes and low-risk improvements
- minor releases may still include breaking changes if the public API or packaging model needs to improve before `1.0`
- breaking changes should be called out in release notes

## Supported Versions

- the latest published npm release
- the current `main` branch

There are no long-term support branches at the moment.

## Platform Support

Published prebuilds currently target:

- macOS: `arm64`, `x64`
- Linux GNU libc: `arm64`, `x64`
- Windows: `x64`

Linux musl and Alpine are not supported yet.