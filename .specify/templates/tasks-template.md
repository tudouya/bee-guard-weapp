# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **WeChat Mini-Program**: `pages/`, `components/`, `services/`, `utils/` at repository root
- **Subpackages**: `packageKnowledge/`, `packageCommunity/`, `packageCharts/`
- **Configuration**: `app.json`, `project.config.json`, `sitemap.json`
- Paths shown below assume WeChat mini-program structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 3.2: Service Layer Setup ⚠️ MUST COMPLETE BEFORE PAGE IMPLEMENTATION
**CRITICAL: Service layer and utilities MUST be implemented before page components**
- [ ] T004 [P] API service base class in services/base.js
- [ ] T005 [P] Authentication service in services/auth.js
- [ ] T006 [P] Detection service in services/detection.js
- [ ] T007 [P] Epidemic data service in services/epidemic.js

## Phase 3.3: Core Page Implementation (ONLY after services are ready)
- [ ] T008 [P] Home page structure in pages/index/
- [ ] T009 [P] Detection flow pages in pages/detection/
- [ ] T010 [P] Epidemic monitoring page in pages/epidemic/
- [ ] T011 User authentication integration
- [ ] T012 WeChat payment integration
- [ ] T013 Form validation utilities
- [ ] T014 Error handling and user feedback

## Phase 3.4: Subpackage Implementation
- [ ] T015 [P] Knowledge base subpackage in packageKnowledge/
- [ ] T016 [P] Community subpackage in packageCommunity/
- [ ] T017 [P] Charts subpackage in packageCharts/
- [ ] T018 Configure subpackage preload rules

## Phase 3.5: Polish & Testing
- [ ] T019 [P] Component testing in WeChat Developer Tools
- [ ] T020 Performance optimization and loading states
- [ ] T021 [P] Image optimization and caching
- [ ] T022 Code review for legacy component adaptations
- [ ] T023 WeChat mini-program compliance check

## Dependencies
- Services (T004-T007) before pages (T008-T014)
- Core pages (T008-T010) before integration (T011-T014)
- Main package before subpackages (T015-T018)
- Implementation before polish/testing (T019-T023)

## Parallel Example
```
# Launch T004-T007 together:
Task: "API service base class in services/base.js"
Task: "Authentication service in services/auth.js"
Task: "Detection service in services/detection.js"
Task: "Epidemic data service in services/epidemic.js"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify service layer before implementing pages
- Test in WeChat Developer Tools after each task
- Avoid: direct legacy path references, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task