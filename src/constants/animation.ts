export const ANIMATION = {
  reducedQuery: '(prefers-reduced-motion: reduce)',
  reveal: {
    initial: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
    viewport: { once: true, amount: 0.1 },
  },
  branch: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
} as const
export const SCROLL_PATH = {
  offset: ['start end', 'end center'],
  input: [0.05, 0.95],
  output: [0, 1],
  d: 'M1 0 V100',
} as const
