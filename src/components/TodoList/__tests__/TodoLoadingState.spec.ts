import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoLoadingState from '../TodoLoadingState.vue';

describe('TodoLoadingState', () => {
  it('should render spinner', () => {
    const wrapper = mount(TodoLoadingState);

    expect(wrapper.find('.q-spinner').exists()).toBe(true);
  });

  it('should render with center alignment', () => {
    const wrapper = mount(TodoLoadingState);

    expect(wrapper.find('.text-center').exists()).toBe(true);
  });

  it('should match snapshot', () => {
    const wrapper = mount(TodoLoadingState);
    
    expect(wrapper.html()).toMatchSnapshot();
  });
});
