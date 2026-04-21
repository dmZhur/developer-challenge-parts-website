// Maps non-CSS colour names to hex values.
// Standard CSS named colours (black, white, silver, red, blue…) work directly
// as CSS background values and don't need an entry here.
const COLOR_HEX: Record<string, string> = {
  primer: '#9ca3af',
  chrome: '#b8bcc8',
};

export function swatchFor(colour: string): string {
  return COLOR_HEX[colour] ?? colour;
}
