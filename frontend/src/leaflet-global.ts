/**
 * Expone Leaflet como global para que leaflet.heat (que usa L global) use la misma instancia.
 * Debe importarse antes que 'leaflet.heat'.
 */
import * as L from 'leaflet';
(window as unknown as { L: typeof L }).L = L;
export { L };
