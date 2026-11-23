// The browser bundle and its clock integration test share Fiber's ESM entry.
declare module '@react-three/fiber/dist/react-three-fiber.esm.js' {
  export { createRoot, _roots, advance } from '@react-three/fiber'
  export type { RootState } from '@react-three/fiber'
}
