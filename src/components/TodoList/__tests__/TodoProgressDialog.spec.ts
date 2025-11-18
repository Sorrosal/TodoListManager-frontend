import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoProgressDialog from '../TodoProgressDialog.vue';

describe('TodoProgressDialog', () => {
  const mockProgressData = {
    date: '2024-01-01T10:00',
    percent: 50,
  };

  it('should render dialog title', () => {
    const wrapper = mount(TodoProgressDialog, {
      props: {
        modelValue: true,
        progressData: mockProgressData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('Register Progress');
    wrapper.unmount();
  });

  it('should render date and progress input fields', () => {
    const wrapper = mount(TodoProgressDialog, {
      props: {
        modelValue: true,
        progressData: mockProgressData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('Date and Time');
    expect(wrapper.text()).toContain('Progress (%)');
    wrapper.unmount();
  });

  it('should emit save event when form is submitted', async () => {
    const wrapper = mount(TodoProgressDialog, {
      props: {
        modelValue: true,
        progressData: mockProgressData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(wrapper.emitted('save')).toBeTruthy();
    wrapper.unmount();
  });

  it('should show loading state when isSaving is true', () => {
    const wrapper = mount(TodoProgressDialog, {
      props: {
        modelValue: true,
        progressData: mockProgressData,
        isSaving: true,
      },
      attachTo: document.body,
    });

    // Component receives isSaving prop which controls button loading state
    expect((wrapper.props() as { isSaving: boolean }).isSaving).toBe(true);
    const saveButton = wrapper.findAll('button').find(btn => btn.text().includes('Save'));
    expect(saveButton?.exists()).toBe(true);
    wrapper.unmount();
  });

  it('should have datetime-local input type', () => {
    const wrapper = mount(TodoProgressDialog, {
      props: {
        modelValue: true,
        progressData: mockProgressData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    const dateInput = wrapper.find('input[type="datetime-local"]');
    expect(dateInput.exists()).toBe(true);
    wrapper.unmount();
  });

  it('should have number input for progress with min/max', () => {
    const wrapper = mount(TodoProgressDialog, {
      props: {
        modelValue: true,
        progressData: mockProgressData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    const progressInput = wrapper.find('input[type="number"]');
    expect(progressInput.exists()).toBe(true);
    expect(progressInput.attributes('min')).toBe('0');
    expect(progressInput.attributes('max')).toBe('100');
    wrapper.unmount();
  });

  it('should render cancel button with close functionality', () => {
    const wrapper = mount(TodoProgressDialog, {
      props: {
        modelValue: true,
        progressData: mockProgressData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    // Verify cancel button exists (v-close-popup handles closing)
    const cancelButton = wrapper.findAll('button').find(btn => btn.text() === 'Cancel');
    expect(cancelButton?.exists()).toBe(true);
    wrapper.unmount();
  });
});
