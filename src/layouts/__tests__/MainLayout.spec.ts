import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import MainLayout from '../MainLayout.vue';
import { authService } from 'src/services';

vi.mock('src/services', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    removeToken: vi.fn(),
  },
}));

vi.mock('quasar', async () => {
  const actual = await vi.importActual('quasar');
  return {
    ...actual,
    Dialog: {
      create: vi.fn(() => ({
        onOk: vi.fn((callback) => {
          callback();
          return { onCancel: vi.fn() };
        }),
      })),
    },
  };
});

describe('MainLayout', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: { template: '<div>Home</div>' },
        },
        {
          path: '/login',
          component: { template: '<div>Login</div>' },
        },
      ],
    });
  });

  it('should render the layout with title', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain('Todo List Manager');
  });

  it('should show user info when authenticated', async () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    });

    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });

    // Wait for onMounted to complete
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.text()).toContain('Welcome');
  });

  it('should not show user info when not authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).not.toContain('Welcome');
    expect(wrapper.text()).not.toContain('Logout');
  });

  it('should handle logout when logout button is clicked', async () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    });

    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Find the logout button in the user info section - it's the button with the Logout tooltip
    const buttons = wrapper.findAll('button');
    // The logout button should be in the header area with user info
    const logoutButton = buttons[buttons.length - 1]; // Last button in header (after username display)
    expect(logoutButton).toBeDefined();
    if (logoutButton) {
      await logoutButton.trigger('click');
    }

    expect(authService.removeToken).toHaveBeenCalled();
  });

  it('should handle wrapped username object', async () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      id: 1,
      username: { value: 'testuser' } as unknown as string,
      email: 'test@example.com',
    });

    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Username should be extracted correctly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.vm as any).username).toBe('testuser');
  });

  it('should show default username when user data is not available', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.vm as any).username).toBe('User');
  });

  it('should handle error when fetching user fails', async () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockRejectedValue(
      new Error('Failed to fetch user')
    );

    const consoleSpy = vi.spyOn(console, 'error');

    mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch user:',
      expect.any(Error)
    );
  });
});
