# Testing Infrastructure

This directory contains the comprehensive test suite for the Gasnet.org documentation site.

## Test Structure

```
tests/
├── setup.js              # Global test configuration and mocks
├── unit/                 # Unit tests for utilities and hooks
│   ├── colors.test.js
│   ├── chartUtils.test.js
│   ├── validateJson.test.js
│   ├── useChartTheme.test.js
│   └── useChartData.test.js
├── component/            # Component tests
│   ├── ErrorBoundary.test.js
│   ├── LoadingState.test.js
│   ├── BenchmarkChart.test.js
│   ├── CaseStudyCharts.test.js
│   └── BenchmarkCompare.test.js
├── integration/          # Integration tests
│   └── build.test.js
├── validation/           # Data validation tests
│   ├── benchmark-schema.test.js
│   ├── links.test.js
│   └── images.test.js
└── accessibility/        # Accessibility tests
    └── a11y.test.js
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit         # Unit tests only
npm run test:component    # Component tests only
npm run test:integration  # Integration tests only
npm run test:validation   # Validation tests only
npm run test:a11y         # Accessibility tests only
```

## Coverage Thresholds

- Lines: 60%
- Functions: 60%
- Branches: 50%
- Statements: 60%

## Test Categories

### Unit Tests

Test individual functions and utilities in isolation:

- `colors.js` - WCAG-compliant color constants
- `chartUtils.js` - Chart configuration builders
- `validateJson.js` - JSON schema validation
- `useChartTheme.js` - Theme hook
- `useChartData.js` - Data fetching hook

### Component Tests

Test React components with React Testing Library:

- `ErrorBoundary` - Error catching and display
- `LoadingState` - Loading indicators
- `BenchmarkChart` - Latency chart component
- `CaseStudyCharts` - Case study visualizations
- `BenchmarkCompare` - Multi-dataset comparison

### Integration Tests

Test that multiple modules work together:

- Build process succeeds
- Static files are generated
- Critical paths work

### Validation Tests

Validate data and content:

- JSON schema compliance for benchmark data
- Internal links resolve
- Images have alt text and exist

### Accessibility Tests

Verify WCAG compliance:

- Color contrast ratios
- ARIA labels and roles
- Screen reader support
- Keyboard navigation support

## Adding New Tests

1. Place unit tests in `tests/unit/`
2. Place component tests in `tests/component/`
3. Use descriptive test names that explain what is being tested
4. Follow the Arrange-Act-Assert pattern
5. Mock external dependencies (fetch, sessionStorage, etc.)

## CI/CD

Tests run automatically on:

- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

See `.github/workflows/test.yml` for details.
