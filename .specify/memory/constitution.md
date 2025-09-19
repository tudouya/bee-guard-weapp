<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- Added all core principles for bee-guard-weapp mini-program project
- Added Compliance Standards section specific to mini-program development
- Added Development Workflow section with WeChat mini-program specific requirements
- Templates requiring updates:
  ✅ plan-template.md - Constitution references updated
  ✅ spec-template.md - Aligned with mini-program requirements
  ✅ tasks-template.md - Updated for WeChat mini-program task types
- Follow-up TODOs: None - all placeholders filled
-->

# Bee Guard Constitution

## Core Principles

### I. Mini-Program Native-First
WeChat mini-program native development is mandatory; All components must use mini-program native APIs and conventions; No hybrid frameworks or third-party UI libraries except ECharts for data visualization; Maintain WeChat platform compatibility and performance standards.

### II. Component Reuse Strategy
Leverage existing components from smart-hive-weapp legacy codebase through copy-and-adapt approach; Never reference legacy paths directly - copy code to new project structure; Prioritize reuse of proven utilities (date formatting, API requests) and base components; Modify copied components to match new project requirements and style consistency.

### III. Subpackage Optimization (NON-NEGOTIABLE)
Implement strategic subpackaging for performance: knowledge and community features in separate packages; Use preload rules for critical user flows; Main package must contain only core detection and epidemic monitoring features; Package size limits strictly enforced per WeChat guidelines.

### IV. API Service Layer Separation
All API calls must go through dedicated service layer (services/ directory); No direct API calls from page components; Consistent error handling and response transformation; Support both development and production environment configurations.

### V. WeChat Integration Excellence
Leverage WeChat's native capabilities: mini-program login, WeChat Pay, sharing, and media upload; Implement proper permission handling for camera, location, and user data; Follow WeChat UI/UX guidelines and interaction patterns; Ensure seamless integration with WeChat ecosystem.

## Compliance Standards

### WeChat Mini-Program Requirements
All code must pass WeChat mini-program review standards; Implement proper user privacy protection and data collection declarations; Follow WeChat's content guidelines for agricultural/medical content; Maintain compatibility with WeChat Developer Tools build process.

### Code Quality Standards
Use consistent naming conventions following JavaScript and WeChat mini-program standards; Implement proper error boundaries and graceful degradation; Maintain clean separation between presentation, business logic, and data layers; Code must be reviewed before commit to ensure style consistency.

### Performance Standards
Page load time under 2 seconds on 3G networks; Package size optimization following WeChat's subpackage strategy; Efficient image loading and caching for disease reference materials; Proper loading states and error handling for all network operations.

## Development Workflow

### Testing and Validation
Manual testing required in WeChat Developer Tools before deployment; Test on both iOS and Android WeChat platforms; Validate all payment flows in sandbox environment; Verify proper handling of network failures and edge cases.

### Legacy Code Integration
When copying from smart-hive-weapp: ensure code review for security and performance; Update variable names and styling to match new project conventions; Remove unused dependencies and functionality; Document any modifications made during adaptation.

### Version Control Standards
Commit messages must include feature context and affected components; Branch naming: feature/detection-*, feature/epidemic-*, feature/community-*; No direct commits to main branch - use feature branches and reviews; Tag releases with WeChat mini-program version alignment.

## Governance

Constitution supersedes all other development practices; All code reviews must verify compliance with native-first and subpackage principles; Component reuse decisions must be documented and justified; Performance degradation requires architectural review and approval.

Use CLAUDE.md for runtime development guidance and project-specific instructions.

**Version**: 1.0.0 | **Ratified**: 2025-09-19 | **Last Amended**: 2025-09-19