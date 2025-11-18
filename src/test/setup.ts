import { config } from '@vue/test-utils';
import { Quasar, Dialog, Notify } from 'quasar';
import { vi } from 'vitest';
import type { VNode } from 'vue';

// Configure Vue Test Utils
config.global.plugins = [
  [
    Quasar,
    {
      plugins: {
        Dialog,
        Notify,
      },
    },
  ],
];

// Stub Quasar components that use teleport or special handling (doesn't work in JSDOM)
config.global.stubs = {
  QDialog: {
    template: '<div class="q-dialog"><slot /></div>',
    props: ['modelValue'],
  },
  QForm: {
    template: '<form @submit.prevent="$emit(\'submit\', $event)"><slot /></form>',
  },
};

// Stub Quasar directives
config.global.directives = {
  'close-popup': {
    mounted(el: HTMLElement, binding: unknown, vnode: VNode) {
      el.setAttribute('data-close-popup', 'true');
      el.addEventListener('click', () => {
        // Walk up the component tree to find the dialog
        let instance: unknown = vnode.component && vnode.component.proxy;
        while (instance && typeof instance === 'object') {
          // Check if this component has modelValue prop (likely a dialog)
          if (
            '$props' in instance &&
            (instance as { $props: { modelValue?: unknown } }).$props?.modelValue !== undefined
          ) {
            // Emit the update:modelValue event
            if (
              '$emit' in instance &&
              typeof (instance as { $emit: (event: string, ...args: unknown[]) => void }).$emit === 'function'
            ) {
              (instance as { $emit: (event: string, ...args: unknown[]) => void }).$emit('update:modelValue', false);
            }
            break;
          }
          instance = (instance as { $parent?: unknown }).$parent;
        }
      });
    },
  },
};

// Mock localStorage
const localStorageMock: Partial<Storage> = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

// Mock window.location.reload only
Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    reload: vi.fn(),
  },
  configurable: true,
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
