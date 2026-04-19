// Twitter card uses the same image as Open Graph.
// Fields below are duplicated verbatim (not re-exported) because Next's
// static analyzer only accepts inline string literals for `runtime`.
import Image from './opengraph-image';

export const runtime = 'nodejs';
export const alt = "Steph's Grad Party — you're invited";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default Image;
