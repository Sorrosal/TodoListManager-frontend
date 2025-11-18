import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoDialogs } from '../useTodoDialogs';
import type { TodoItem } from 'src/models';

describe('useTodoDialogs', () => {
  const mockTodoItem: TodoItem = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    category: 'Work',
    progressions: [],
  };

  beforeEach(() => {
    // Reset any state if needed
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const {
        showAddDialog,
        showProgressDialogFlag,
        showHistoryDialogFlag,
        isSaving,
        editingItem,
        progressItem,
        historyItem,
        formData,
        progressData,
      } = useTodoDialogs();

      expect(showAddDialog.value).toBe(false);
      expect(showProgressDialogFlag.value).toBe(false);
      expect(showHistoryDialogFlag.value).toBe(false);
      expect(isSaving.value).toBe(false);
      expect(editingItem.value).toBeNull();
      expect(progressItem.value).toBeNull();
      expect(historyItem.value).toBeNull();
      expect(formData.value).toEqual({
        title: '',
        description: '',
        category: '',
      });
      expect(progressData.value.percent).toBe(0);
      expect(progressData.value.date).toBeTruthy();
    });
  });

  describe('openAddDialog', () => {
    it('should open add dialog and reset form', () => {
      const { openAddDialog, showAddDialog, formData } = useTodoDialogs();

      openAddDialog();

      expect(showAddDialog.value).toBe(true);
      expect(formData.value).toEqual({
        title: '',
        description: '',
        category: '',
      });
    });
  });

  describe('openEditDialog', () => {
    it('should open edit dialog with item data', () => {
      const { openEditDialog, showAddDialog, editingItem, formData } =
        useTodoDialogs();

      openEditDialog(mockTodoItem);

      expect(showAddDialog.value).toBe(true);
      expect(editingItem.value).toEqual(mockTodoItem);
      expect(formData.value).toEqual({
        title: 'Test Task',
        description: 'Test Description',
        category: 'Work',
      });
    });
  });

  describe('openProgressDialog', () => {
    it('should open progress dialog with item', () => {
      const { openProgressDialog, showProgressDialogFlag, progressItem, progressData } =
        useTodoDialogs();

      openProgressDialog(mockTodoItem);

      expect(showProgressDialogFlag.value).toBe(true);
      expect(progressItem.value).toEqual(mockTodoItem);
      expect(progressData.value.percent).toBe(0);
      expect(progressData.value.date).toBeTruthy();
    });
  });

  describe('openHistoryDialog', () => {
    it('should open history dialog with item', () => {
      const { openHistoryDialog, showHistoryDialogFlag, historyItem } =
        useTodoDialogs();

      openHistoryDialog(mockTodoItem);

      expect(showHistoryDialogFlag.value).toBe(true);
      expect(historyItem.value).toEqual(mockTodoItem);
    });
  });

  describe('closeAddDialog', () => {
    it('should close add dialog and reset form', () => {
      const { openEditDialog, closeAddDialog, showAddDialog, editingItem, formData } =
        useTodoDialogs();

      // First open and populate
      openEditDialog(mockTodoItem);
      expect(showAddDialog.value).toBe(true);
      expect(editingItem.value).toEqual(mockTodoItem);

      // Then close
      closeAddDialog();

      expect(showAddDialog.value).toBe(false);
      expect(editingItem.value).toBeNull();
      expect(formData.value).toEqual({
        title: '',
        description: '',
        category: '',
      });
    });
  });

  describe('closeProgressDialog', () => {
    it('should close progress dialog', () => {
      const { openProgressDialog, closeProgressDialog, showProgressDialogFlag } =
        useTodoDialogs();

      // First open
      openProgressDialog(mockTodoItem);
      expect(showProgressDialogFlag.value).toBe(true);

      // Then close
      closeProgressDialog();

      expect(showProgressDialogFlag.value).toBe(false);
    });
  });

  describe('resetForm', () => {
    it('should reset form data and editing item', () => {
      const { openEditDialog, resetForm, editingItem, formData } =
        useTodoDialogs();

      // First populate
      openEditDialog(mockTodoItem);
      expect(editingItem.value).toEqual(mockTodoItem);

      // Then reset
      resetForm();

      expect(editingItem.value).toBeNull();
      expect(formData.value).toEqual({
        title: '',
        description: '',
        category: '',
      });
    });
  });

  describe('Date Format', () => {
    it('should initialize progressData with datetime-local compatible format', () => {
      const { progressData } = useTodoDialogs();

      // Check format is YYYY-MM-DDTHH:MM
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      expect(progressData.value.date).toMatch(dateRegex);
    });
  });
});
