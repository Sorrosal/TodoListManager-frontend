import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import LoginPage from '../LoginPage.vue';
import { authService } from 'src/services';
import { Notify } from 'quasar';

vi.mock('src/services', () => ({
  authService: {
    login: vi.fn(),
    setToken: vi.fn(),
  },
}));

vi.mock('quasar', async () => {
  const actual = await vi.importActual('quasar');
  return {
    ...actual,
    Notify: {
      create: vi.fn(),
    },
  };
});

describe('LoginPage', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/login',
          component: LoginPage,
        },
        {
          path: '/todos',
          component: { template: '<div>Todos</div>' },
        },
      ],
    });
  });

  it('should render login form', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain('TodoList Manager');
    expect(wrapper.text()).toContain('Sign in to your account');
    expect(wrapper.text()).toContain('Username');
    expect(wrapper.text()).toContain('Password');
  });

  it('should have username and password inputs', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });

    const inputs = wrapper.findAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('should have sign in button', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });

    const button = wrapper.find('button[type="submit"]');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('Sign In');
  });

  it('should toggle password visibility', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.vm as any).showPassword).toBe(false);

    // Find visibility toggle icon
    const visibilityIcon = wrapper.findAll('.q-icon').find(icon => 
      icon.text().includes('visibility')
    );
    
    if (visibilityIcon) {
      await visibilityIcon.trigger('click');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((wrapper.vm as any).showPassword).toBe(true);
    }
  });

  it('should handle successful login', async () => {
    const mockResponse = {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    };

    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });

    // Set credentials
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).credentials.username = 'testuser';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).credentials.password = 'password123';

    // Submit form
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    // Wait for async operations
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(authService.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
    expect(authService.setToken).toHaveBeenCalledWith('mock-jwt-token');
    expect(Notify.create).toHaveBeenCalledWith({
      type: 'positive',
      message: 'Login successful!',
      position: 'top',
    });
  });

  it('should handle login error', async () => {
    const error = {
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    };

    vi.mocked(authService.login).mockRejectedValue(error);

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });

    // Set credentials
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).credentials.username = 'wronguser';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).credentials.password = 'wrongpass';

    // Submit form
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    // Wait for async operations
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(authService.login).toHaveBeenCalled();
    expect(Notify.create).toHaveBeenCalledWith({
      type: 'negative',
      message: 'Invalid credentials',
      position: 'top',
    });
  });

  it('should show default error message when error has no message', async () => {
    const error = new Error('Network error');

    vi.mocked(authService.login).mockRejectedValue(error);

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).credentials.username = 'testuser';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).credentials.password = 'password123';

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(Notify.create).toHaveBeenCalledWith({
      type: 'negative',
      message: 'Login failed. Please check your credentials.',
      position: 'top',
    });
  });

  it('should set loading state during login', async () => {
    let resolveLogin: (() => void) | undefined;
    vi.mocked(authService.login).mockImplementation(
      () => new Promise((resolve) => {
        resolveLogin = () => resolve({ token: 'test-token', user: { id: 1, username: 'test', email: 'test@test.com' } });
      })
    );

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).credentials.username = 'testuser';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).credentials.password = 'password123';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.vm as any).isLoading).toBe(false);

    const form = wrapper.find('form');
    void form.trigger('submit.prevent');

    // Wait for the async function to start
    await new Promise((resolve) => setTimeout(resolve, 0));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.vm as any).isLoading).toBe(true);

    // Resolve the login promise
    if (resolveLogin) resolveLogin();
    await new Promise((resolve) => setTimeout(resolve, 0));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.vm as any).isLoading).toBe(false);
  });
});
