export interface Point {
  x: number
  y: number
}

export function getPoints(values: number[], width: number, height: number, pad = 4): Point[] {
  if (!values.length) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = values.length > 1 ? width / (values.length - 1) : width
  return values.map((value, index) => ({
    x: index * stepX,
    y: height - ((value - min) / span) * (height - pad * 2) - pad,
  }))
}

export function linePath(points: Point[]): string {
  if (!points.length) return ''
  if (points.length < 3) {
    return points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')
  }
  let path = `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index]
    const p1 = points[index]
    const p2 = points[index + 1]
    const p3 = points[index + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    path += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
  }
  return path
}

export function areaPath(points: Point[], baseline: number): string {
  if (!points.length) return ''
  const line = linePath(points)
  const first = points[0]
  const last = points[points.length - 1]
  return `${line} L${last.x.toFixed(2)},${baseline.toFixed(2)} L${first.x.toFixed(2)},${baseline.toFixed(2)} Z`
}

export function niceMax(value: number): number {
  if (value <= 0) return 1
  const power = Math.pow(10, Math.floor(Math.log10(value)))
  const normalized = value / power
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return step * power
}

export function compact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return `${Math.round(value * 10) / 10}`
}
