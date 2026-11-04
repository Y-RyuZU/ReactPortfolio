export type HeldMaterial = {
  kind: 'block' | 'item' | 'icon' | 'picture' | 'write';
  src: string;
};

export const glassMaterial: HeldMaterial = { kind: 'block', src: '/images/minecraft/block/glass.png' };
export const writingMaterial: HeldMaterial = { kind: 'write', src: '/images/minecraft/item/feather.png' };
export const miningMaterial: HeldMaterial = { kind: 'item', src: '/images/minecraft/item/diamond_pickaxe.png' };

/** Read the asset already used by the target; called on job changes, never per frame. */
export function materialForPart(part: HTMLElement): HeldMaterial {
  if (part.matches('h1,h2,h3,h4,p')) return writingMaterial;

  const image = part.matches('img') ? part as HTMLImageElement : part.querySelector('img');
  if (image) {
    const src = image.currentSrc || image.src;
    const url = new URL(src, window.location.href);
    const original = new URL(url.searchParams.get('url') || src, window.location.href);
    if (/name.?plate/i.test(image.alt) || original.pathname.includes('nameplate')) return writingMaterial;
    if (original.pathname.startsWith('/images/minecraft/block/')) return { kind: 'block', src };
    if (original.pathname.startsWith('/images/minecraft/item/')) return { kind: 'item', src };
    return { kind: 'picture', src };
  }

  const svg = part.querySelector('svg');
  if (svg) {
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '34');
    clone.setAttribute('height', '34');
    clone.removeAttribute('class');
    clone.style.color = getComputedStyle(svg).color;
    return { kind: 'icon', src: `data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}` };
  }

  return writingMaterial;
}
