import { createAction } from 'redux-actions';

export const TOGGLE_ASIDE = 'TOGGLE_ASIDE';
export const toggleAside = createAction(TOGGLE_ASIDE);

export const TOGGLE_EDIT_TOOLS = 'TOGGLE_EDIT_TOOLS';
export const toggleEditTools = createAction(TOGGLE_EDIT_TOOLS);

export const SHOW_EDIT_TOOLS = 'SHOW_EDIT_TOOLS';
export const showEditTools = createAction(SHOW_EDIT_TOOLS);

export const HIDE_EDIT_TOOLS = 'HIDE_EDIT_TOOLS';
export const hideEditTools = createAction(HIDE_EDIT_TOOLS);

export const ENTER_REPORT_VIEW = 'ENTER_REPORT_VIEW';
export const enterTemplateView = createAction(ENTER_REPORT_VIEW);

export const LEAVE_REPORT_VIEW = 'LEAVE_REPORT_VIEW';
export const leaveTemplateView = createAction(LEAVE_REPORT_VIEW);

