import { config } from '@vue/test-utils';
import { Quasar, Dialog, Notify } from 'quasar';
import { vi } from 'vitest';

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
    mounted(el, binding, vnode) {
      el.setAttribute('data-close-popup', 'true');
      el.addEventListener('click', () => {
        // Walk up the component tree to find the dialog
        let instance = vnode.ctx;
        while (instance) {
          // Check if this component has modelValue prop (likely a dialog)
          if (instance.props?.modelValue !== undefined) {
            // Emit the update:modelValue event
            instance.emit?.('update:modelValue', false);
            break;
          }
          instance = instance.parent;
        }
      });
    },
  },
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

// Mock window.location
delete (window as { location?: unknown }).location;
window.location = { reload: vi.fn() } as unknown as Location;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
