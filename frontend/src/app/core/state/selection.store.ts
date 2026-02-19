import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectionStore {
  private readonly _selected = signal<Set<string>>(new Set());

  readonly selected = computed(() => this._selected());

  toggle(name: string) {
    const next = new Set(this._selected());
    if (next.has(name)) next.delete(name);
    else next.add(name);
    this._selected.set(next);
  }

  isSelected(name: string) {
    return this._selected().has(name);
  }

  setAll(names: string[]) {
    this._selected.set(new Set(names));
  }

  clear() {
    this._selected.set(new Set());
  }

  isAllSelected(names: string[]) {
    const s = this._selected();
    return names.every(n => s.has(n));
  }
}
