import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoHistoryDialog from '../TodoHistoryDialog.vue';
import type { TodoItem } from 'src/models';

describe('TodoHistoryDialog', () => {
  const mockHistoryItem: TodoItem = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    category: 'Work',
    totalProgress: 75,
    isCompleted: false,
    lastProgressionDate: '2024-01-03T10:00:00Z',
    progressions: [
      { id: 1, date: '2024-01-01T10:00:00Z', percent: 25, todoItemId: 1 },
      { id: 2, date: '2024-01-02T10:00:00Z', percent: 50, todoItemId: 1 },
      { id: 3, date: '2024-01-03T10:00:00Z', percent: 75, todoItemId: 1 },
    ],
  };

  const mockGetSortedProgressions = vi.fn((item: TodoItem) => {
    if (!item.progressions) return [];

    // Sort by date ascending to calculate cumulative
    const sorted = [...item.progressions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Calculate cumulative progress
    let cumulative = 0;
    const withCumulative = sorted.map((progression) => {
      cumulative = Math.min(100, cumulative + progression.percent);
      return {
        ...progression,
        cumulativePercent: cumulative,
      };
    });

    // Return in descending order (most recent first)
    return withCumulative.reverse();
  });

  const mockFormatDate = vi.fn((date: string) => {
    return new Date(date).toLocaleDateString();
  });

  const mockGetProgressColor = vi.fn((percent: number) => {
    if (percent < 30) return 'negative';
    if (percent < 70) return 'warning';
    return 'positive';
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog title', () => {
    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: mockHistoryItem,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('Progress History');
    wrapper.unmount();
  });

  it('should render item title', () => {
    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: mockHistoryItem,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('Test Task');
    wrapper.unmount();
  });

  it('should render all progression entries', () => {
    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: mockHistoryItem,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('25%');
    expect(wrapper.text()).toContain('50%');
    expect(wrapper.text()).toContain('75%');
    wrapper.unmount();
  });

  it('should call formatDate for each progression', () => {
    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: mockHistoryItem,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    expect(mockFormatDate).toHaveBeenCalledWith('2024-01-01T10:00:00Z');
    expect(mockFormatDate).toHaveBeenCalledWith('2024-01-02T10:00:00Z');
    expect(mockFormatDate).toHaveBeenCalledWith('2024-01-03T10:00:00Z');
    wrapper.unmount();
  });

  it('should call getProgressColor for each progression', () => {
    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: mockHistoryItem,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    expect(mockGetProgressColor).toHaveBeenCalledWith(25);
    expect(mockGetProgressColor).toHaveBeenCalledWith(75);
    expect(mockGetProgressColor).toHaveBeenCalledWith(100);
    wrapper.unmount();
  });

  it('should show empty message when no progressions', () => {
    const emptyItem: TodoItem = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      category: 'Work',
      totalProgress: 0,
      isCompleted: false,
      lastProgressionDate: null,
      progressions: [],
    };

    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: emptyItem,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('No progress history available');
    wrapper.unmount();
  });

  it('should show empty message when historyItem is null', () => {
    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: null,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain('No progress history available');
    wrapper.unmount();
  });

  it('should render close button with close functionality', () => {
    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: mockHistoryItem,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    // Verify close button exists (v-close-popup handles closing)
    const closeButton = wrapper.find('button');
    expect(closeButton.exists()).toBe(true);
    wrapper.unmount();
  });

  it('should use getSortedProgressions to order items', () => {
    const wrapper = mount(TodoHistoryDialog, {
      props: {
        modelValue: true,
        historyItem: mockHistoryItem,
        getSortedProgressions: mockGetSortedProgressions,
        formatDate: mockFormatDate,
        getProgressColor: mockGetProgressColor,
      },
      attachTo: document.body,
    });

    expect(mockGetSortedProgressions).toHaveBeenCalledWith(mockHistoryItem);
    wrapper.unmount();
  });
});
