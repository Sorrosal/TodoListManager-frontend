import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoListHeader from '../TodoListHeader.vue';

describe('TodoListHeader', () => {
  it('should render title and subtitle', () => {
    const wrapper = mount(TodoListHeader);

    expect(wrapper.text()).toContain('My Todo List');
    expect(wrapper.text()).toContain('Manage your tasks efficiently');
  });

  it('should render add task button', () => {
    const wrapper = mount(TodoListHeader);

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('Add Task');
  });

  it('should emit add-task event when button is clicked', async () => {
    const wrapper = mount(TodoListHeader);

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.emitted('add-task')).toBeTruthy();
    expect(wrapper.emitted('add-task')?.length).toBe(1);
  });

  it('should match snapshot', () => {
    const wrapper = mount(TodoListHeader);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
