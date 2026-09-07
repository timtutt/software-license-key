# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2025-02-22

### Fixed

- **Security:** Add npm `overrides` to resolve high-severity ReDoS vulnerability in `minimatch` (GHSA-3ppc-4f35-3m26). The override forces `minimatch@>=10.2.1` for the dependency tree (used by Mocha’s `glob`). No API or implementation changes; library behavior is unchanged.

## [1.0.2]

- Previous releases (no changelog maintained).

[Unreleased]: https://github.com/timtutt/software-license-key/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/timtutt/software-license-key/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/timtutt/software-license-key/releases/tag/v1.0.2
