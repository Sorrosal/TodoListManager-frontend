import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoEmptyState from '../TodoEmptyState.vue';

describe('TodoEmptyState', () => {
  it('should render empty state message', () => {
    const wrapper = mount(TodoEmptyState);

    expect(wrapper.text()).toContain('No tasks yet');
  });

  it('should render helpful subtitle', () => {
    const wrapper = mount(TodoEmptyState);

    expect(wrapper.text()).toContain('Click "Add Task" to create your first todo item');
  });

  it('should render icon', () => {
    const wrapper = mount(TodoEmptyState);

    expect(wrapper.find('.q-icon').exists()).toBe(true);
  });

  it('should render with center alignment', () => {
    const wrapper = mount(TodoEmptyState);

    expect(wrapper.find('.text-center').exists()).toBe(true);
  });

  it('should match snapshot', () => {
    const wrapper = mount(TodoEmptyState);
    
    expect(wrapper.html()).toMatchSnapshot();
  });
});
