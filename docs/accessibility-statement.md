---
sidebar_position: 99
title: Accessibility Statement
---

# Accessibility Statement

**Last Updated:** January 15, 2026

## Commitment to Accessibility

Gasnet.org is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.

## Target Conformance Level

We aim to achieve **WCAG 2.1 Level AA** conformance as specified by the World Wide Web Consortium (W3C). This site is designed to be compatible with assistive technologies including:

- Screen readers (JAWS, NVDA, VoiceOver, TalkBack)
- Screen magnification software
- Speech recognition software
- Alternative input devices

## Accessibility Features

### 1. Color and Contrast

- All text meets or exceeds WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- Color is not used as the only means of conveying information
- Full support for light and dark color modes with maintained contrast ratios

### 2. Keyboard Navigation

- All interactive elements are keyboard accessible
- Visible focus indicators on all interactive elements
- Logical tab order throughout the site
- Skip links provided to jump directly to main content
- No keyboard traps

### 3. Screen Reader Support

- Semantic HTML structure with proper heading hierarchy
- ARIA labels on interactive elements without visible labels
- Chart components include text descriptions for data visualization
- Form inputs have associated labels
- Tables include proper headers

### 4. Responsive Design

- Content is readable and functional at all viewport sizes
- Text can be zoomed up to 200% without loss of functionality
- Touch targets meet minimum size requirements (44x44 pixels)

### 5. Motion Preferences

- Respects `prefers-reduced-motion` setting
- Animations can be disabled for users who prefer reduced motion

### 6. Alternative Text

- All images include descriptive alt text
- Decorative images are marked to be ignored by screen readers

## Known Limitations

### Third-Party Components

This site uses third-party services that may have accessibility limitations:

1. **Giscus Comments** - Powered by GitHub Discussions. While we've added ARIA labels, the underlying widget's accessibility depends on the service provider.

2. **Local Search** - Search functionality is provided by a third-party plugin. We continuously work to improve its accessibility.

### Mathematical Content

Mathematical equations are rendered using KaTeX. While KaTeX has good accessibility support, complex equations may be challenging for some screen reader configurations. We are exploring alternatives to improve this experience.

### Charts and Data Visualization

Interactive charts use Chart.js. We provide text descriptions, but the interactive visualizations may be challenging for some users. We are working on providing alternative data table views.

## Technical Approach

Our accessibility implementation includes:

- **Skip Links**: CSS-hidden "skip to main content" links that appear on focus
- **Focus Management**: Clear focus indicators using `:focus-visible` pseudo-class
- **ARIA Attributes**: Proper use of `role`, `aria-label`, `aria-live`, and other ARIA attributes
- **Semantic HTML**: Proper use of landmark roles (`<nav>`, `<main>`, `<article>`, etc.)
- **Color Contrast**: Regular auditing of color combinations for WCAG AA compliance

## Testing

We regularly test this site using:

- Automated accessibility testing tools
- Keyboard-only navigation
- Screen reader testing (VoiceOver on macOS, NVDA on Windows)
- Browser developer tools accessibility inspections
- Color contrast analyzers

## Reporting Accessibility Issues

We are committed to addressing accessibility issues promptly.

### How to Report

If you encounter an accessibility barrier on this site, please:

1. **Email us**: [accessibility@gasnet.org](mailto:accessibility@gasnet.org)
2. **Open an Issue**: [GitHub Issues](https://github.com/gasnet/gasnet.org/issues)

When reporting, please include:

- The page or section where you encountered the barrier
- The assistive technology or browser you were using
- A description of the issue

### Response Time

We aim to acknowledge accessibility reports within 2 business days and provide a resolution plan within 5 business days.

## Ongoing Efforts

Accessibility is an ongoing process. We regularly:

- Audit new content and features for accessibility
- Update this statement as improvements are made
- Train contributors on accessibility best practices
- Monitor evolving WCAG guidelines and standards

## External Resources

For more information about web accessibility:

- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)

---

_This accessibility statement was last reviewed on January 15, 2026._
