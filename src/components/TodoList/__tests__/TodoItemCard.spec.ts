import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoItemCard from '../TodoItemCard.vue';
import type { TodoItem } from 'src/models';

describe('TodoItemCard', () => {
  const mockItem: TodoItem = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    category: 'Work',
    totalProgress: 50,
    isCompleted: false,
    lastProgressionDate: '2024-01-01T00:00:00Z',
    progressions: [{ id: 1, date: '2024-01-01T00:00:00Z', percent: 50, todoItemId: 1 }],
  };

  it('should render item title and description', () => {
    const wrapper = mount(TodoItemCard, {
      props: {
        item: mockItem,
        progress: 50,
        progressColor: 'warning',
      },
    });

    expect(wrapper.text()).toContain('Test Task');
    expect(wrapper.text()).toContain('Test Description');
  });

  it('should display progress bar when progress is provided', () => {
    const wrapper = mount(TodoItemCard, {
      props: {
        item: mockItem,
        progress: 75,
        progressColor: 'positive',
      },
    });

    expect(wrapper.text()).toContain('Progress');
    expect(wrapper.text()).toContain('75%');
  });

  it('should not display progress bar when progress is null', () => {
    const wrapper = mount(TodoItemCard, {
      props: {
        item: mockItem,
        progress: null,
        progressColor: 'warning',
      },
    });

    expect(wrapper.text()).not.toContain('Progress');
  });

  it('should emit edit event when edit button is clicked', async () => {
    const wrapper = mount(TodoItemCard, {
      props: {
        item: mockItem,
        progress: 50,
        progressColor: 'warning',
      },
    });

    // Find the edit button (first action button)
    const buttons = wrapper.findAll('button');
    await buttons[0]?.trigger('click');

    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockItem]);
  });

  it('should emit add-progress event when progress button is clicked', async () => {
    const wrapper = mount(TodoItemCard, {
      props: {
        item: mockItem,
        progress: 50,
        progressColor: 'warning',
      },
    });

    const buttons = wrapper.findAll('button');
    await buttons[1]?.trigger('click');

    expect(wrapper.emitted('add-progress')).toBeTruthy();
    expect(wrapper.emitted('add-progress')?.[0]).toEqual([mockItem]);
  });

  it('should emit delete event when delete button is clicked', async () => {
    const wrapper = mount(TodoItemCard, {
      props: {
        item: mockItem,
        progress: 50,
        progressColor: 'warning',
      },
    });

    const buttons = wrapper.findAll('button');
    const deleteButton = buttons[buttons.length - 1];
    await deleteButton?.trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockItem]);
  });

  it('should show history button when item has progressions', () => {
    const wrapper = mount(TodoItemCard, {
      props: {
        item: mockItem,
        progress: 50,
        progressColor: 'warning',
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(4); // edit, progress, history, delete
  });

  it('should not show history button when item has no progressions', () => {
    const itemNoProgress: TodoItem = {
      ...mockItem,
      progressions: [],
    };

    const wrapper = mount(TodoItemCard, {
      props: {
        item: itemNoProgress,
        progress: null,
        progressColor: 'warning',
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(3); // edit, progress, delete
  });

  it('should emit view-history event when history button is clicked', async () => {
    const wrapper = mount(TodoItemCard, {
      props: {
        item: mockItem,
        progress: 50,
        progressColor: 'warning',
      },
    });

    const buttons = wrapper.findAll('button');
    await buttons[2]?.trigger('click'); // History button is third

    expect(wrapper.emitted('view-history')).toBeTruthy();
    expect(wrapper.emitted('view-history')?.[0]).toEqual([mockItem]);
  });
});
