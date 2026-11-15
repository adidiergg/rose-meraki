/**
 * Prepares an exported SVG line-art file for the draw-in animation.
 *
 * Every path gets `pathLength="1"` so a single dash pattern can draw it, and a
 * `--t` custom property (0–1) based on the Y of its first point, so the paths
 * are staggered from top to bottom. `fill` is removed and the stroke is drawn
 * instead, which turns filled outline shapes into a pencil-like line.
 *
 * Everything is computed at build time, so the markup already renders in its
 * hidden (undrawn) state without JS.
 */
interface PrepareLineArtOptions {
	/** Class added to the generated `<svg>`, used by the stylesheet. */
	className?: string;
	/** Stroke width in viewBox units. */
	strokeWidth?: number;
	/**
	 * How the artwork fills its box: `contain` keeps the whole drawing visible,
	 * `cover` crops it like a background image.
	 */
	fit?: 'contain' | 'cover';
	/** Which edge stays anchored when `fit` is `cover`. */
	focus?: 'center' | 'top' | 'bottom';
}

const parseViewBoxHeight = (rawSvg: string): number => {
	const match = rawSvg.match(/viewBox="([^"]+)"/);
	if (!match) return 1;

	const parts = match[1].trim().split(/[\s,]+/).map(Number);
	return parts[3] || 1;
};

export const prepareLineArt = (
	rawSvg: string,
	{ className = 'draw-art', strokeWidth = 2, fit = 'contain', focus = 'center' }: PrepareLineArtOptions = {},
): string => {
	const viewBoxHeight = parseViewBoxHeight(rawSvg);
	const align =
		fit === 'cover'
			? focus === 'top'
				? 'xMidYMin slice'
				: focus === 'bottom'
					? 'xMidYMax slice'
					: 'xMidYMid slice'
			: 'xMidYMid meet';

	return rawSvg
		.replace(/<svg([^>]*)>/, (_match: string, attrs: string) => {
			const cleaned = attrs.replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '');
			// The initial (hidden) state also lives on the SVG so it renders correctly
			// even before the stylesheet loads.
			return `<svg${cleaned} class="${className}" preserveAspectRatio="${align}" fill="none" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="1" aria-hidden="true" focusable="false">`;
		})
		.replace(/<path ([^>]*)\/>/g, (_match: string, attrs: string) => {
			const withoutFill = attrs.replace(/(^|\s)fill="[^"]*"/g, '$1');
			const start = withoutFill.match(/\sd="M\s*(-?[\d.]+)[ ,](-?[\d.]+)/);
			const y = start ? Number.parseFloat(start[2]) : 0;
			const t = Math.min(1, Math.max(0, y / viewBoxHeight)).toFixed(3);
			return `<path ${withoutFill} pathLength="1" style="--t:${t}" />`;
		});
};
