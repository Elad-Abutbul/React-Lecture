export const FLOW = {
  width: 260,
  rowGap: 160,
  height: 620,
  minZoom: 0.65,
  maxZoom: 1.25,
  fit: { padding: 0.15, minZoom: 0.65, maxZoom: 1 },
} as const
export const FLOW_LABELS = {
  'controls.zoomIn.ariaLabel': 'הגדלת המפה',
  'controls.zoomOut.ariaLabel': 'הקטנת המפה',
  'controls.fitView.ariaLabel': 'התאמת המפה',
  'controls.interactive.ariaLabel': 'נעילת המפה',
}
