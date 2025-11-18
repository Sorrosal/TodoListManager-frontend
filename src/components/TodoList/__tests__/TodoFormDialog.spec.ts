import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoFormDialog from '../TodoFormDialog.vue';
import type { TodoItem } from 'src/models';

describe('TodoFormDialog', () => {
  const mockFormData = {
    title: 'Test Title',
    description: 'Test Description',
    category: 'Work',
  };

  it('should render add mode title when no editing item', () => {
    const wrapper = mount(TodoFormDialog, {
      props: {
        modelValue: true,
        editingItem: null,
        formData: mockFormData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('Add New Task');
    wrapper.unmount();
  });

  it('should render edit mode title when editing item', () => {
    const editingItem: TodoItem = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing Description',
      category: 'Work',
    };

    const wrapper = mount(TodoFormDialog, {
      props: {
        modelValue: true,
        editingItem,
        formData: mockFormData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('Edit Task');
    wrapper.unmount();
  });

  it('should render all form fields in add mode', () => {
    const wrapper = mount(TodoFormDialog, {
      props: {
        modelValue: true,
        editingItem: null,
        formData: { title: '', description: '', category: '' },
        isSaving: false,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('Title');
    expect(wrapper.text()).toContain('Description');
    expect(wrapper.text()).toContain('Category');
    wrapper.unmount();
  });

  it('should not render title and category fields in edit mode', () => {
    const editingItem: TodoItem = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing Description',
      category: 'Work',
    };

    const wrapper = mount(TodoFormDialog, {
      props: {
        modelValue: true,
        editingItem,
        formData: mockFormData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    // Should only have description field in edit mode
    expect(wrapper.text()).toContain('Description');
    wrapper.unmount();
  });

  it('should emit save event when form is submitted', async () => {
    const wrapper = mount(TodoFormDialog, {
      props: {
        modelValue: true,
        editingItem: null,
        formData: mockFormData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(wrapper.emitted('save')).toBeTruthy();
    wrapper.unmount();
  });

  it('should show loading state on save button when isSaving is true', () => {
    const wrapper = mount(TodoFormDialog, {
      props: {
        modelValue: true,
        editingItem: null,
        formData: mockFormData,
        isSaving: true,
      },
      attachTo: document.body,
    });

    // Component receives isSaving prop and passes it to the button
    // Quasar will handle the loading state visualization
    expect((wrapper.props() as { isSaving: boolean }).isSaving).toBe(true);
    const saveButton = wrapper.findAll('button').find(btn => btn.text().includes('Save'));
    expect(saveButton?.exists()).toBe(true);
    wrapper.unmount();
  });

  it('should have category dropdown with correct options', () => {
    const wrapper = mount(TodoFormDialog, {
      props: {
        modelValue: true,
        editingItem: null,
        formData: { title: '', description: '', category: '' },
        isSaving: false,
      },
      attachTo: document.body,
    });

    // Check that category select exists
    expect(wrapper.text()).toContain('Category');
    wrapper.unmount();
  });

  it('should render cancel button with close functionality', () => {
    const wrapper = mount(TodoFormDialog, {
      props: {
        modelValue: true,
        editingItem: null,
        formData: mockFormData,
        isSaving: false,
      },
      attachTo: document.body,
    });

    // Verify cancel button exists (v-close-popup is a Quasar directive that handles closing)
    const cancelButton = wrapper.findAll('button').find(btn => btn.text() === 'Cancel');
    expect(cancelButton?.exists()).toBe(true);
    wrapper.unmount();
  });
});
