import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoItemList from '../TodoItemList.vue';
import TodoItemCard from '../TodoItemCard.vue';
import type { TodoItem } from 'src/models';

describe('TodoItemList', () => {
  const mockItems: TodoItem[] = [
    {
      id: 1,
      title: 'Work Task 1',
      description: 'Description 1',
      category: 'Work',
      progressions: [],
    },
    {
      id: 2,
      title: 'Work Task 2',
      description: 'Description 2',
      category: 'Work',
      progressions: [],
    },
    {
      id: 3,
      title: 'Personal Task',
      description: 'Description 3',
      category: 'Personal',
      progressions: [],
    },
  ];

  const mockItemsByCategory = {
    Work: [mockItems[0]!, mockItems[1]!],
    Personal: [mockItems[2]!],
  };

  const mockGetLatestProgress = vi.fn(() => 50);
  const mockGetProgressColor = vi.fn(() => 'warning');

  it('should render categories and items', () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: mockItemsByCategory,
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    expect(wrapper.text()).toContain('Work');
    expect(wrapper.text()).toContain('Personal');
  });

  it('should render correct number of TodoItemCard components', () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: mockItemsByCategory,
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    const cards = wrapper.findAllComponents(TodoItemCard);
    expect(cards.length).toBe(3);
  });

  it('should pass correct props to TodoItemCard', () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: mockItemsByCategory,
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    const firstCard = wrapper.findAllComponents(TodoItemCard)[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((firstCard?.props() as any).item).toEqual(mockItems[0]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((firstCard?.props() as any).progress).toBe(50);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((firstCard?.props() as any).progressColor).toBe('warning');
  });

  it('should emit edit event from child card', async () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: mockItemsByCategory,
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    const firstCard = wrapper.findAllComponents(TodoItemCard)[0];
    await firstCard?.vm.$emit('edit', mockItems[0]);

    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockItems[0]]);
  });

  it('should emit add-progress event from child card', async () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: mockItemsByCategory,
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    const firstCard = wrapper.findAllComponents(TodoItemCard)[0];
    await firstCard?.vm.$emit('add-progress', mockItems[0]);

    expect(wrapper.emitted('add-progress')).toBeTruthy();
    expect(wrapper.emitted('add-progress')?.[0]).toEqual([mockItems[0]]);
  });

  it('should emit view-history event from child card', async () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: mockItemsByCategory,
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    const firstCard = wrapper.findAllComponents(TodoItemCard)[0];
    await firstCard?.vm.$emit('view-history', mockItems[0]);

    expect(wrapper.emitted('view-history')).toBeTruthy();
    expect(wrapper.emitted('view-history')?.[0]).toEqual([mockItems[0]]);
  });

  it('should emit delete event from child card', async () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: mockItemsByCategory,
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    const firstCard = wrapper.findAllComponents(TodoItemCard)[0];
    await firstCard?.vm.$emit('delete', mockItems[0]);

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockItems[0]]);
  });

  it('should render nothing when itemsByCategory is empty', () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: {},
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    expect(wrapper.html()).toBe('<!--v-if-->');
  });

  it('should group items correctly by category', () => {
    const wrapper = mount(TodoItemList, {
      props: {
        itemsByCategory: mockItemsByCategory,
        getLatestProgress: mockGetLatestProgress,
        getProgressColor: mockGetProgressColor,
      },
    });

    const categoryHeaders = wrapper.findAll('.category-header');
    expect(categoryHeaders.length).toBe(2);
    expect(categoryHeaders[0]?.text()).toBe('Work');
    expect(categoryHeaders[1]?.text()).toBe('Personal');
  });
});
