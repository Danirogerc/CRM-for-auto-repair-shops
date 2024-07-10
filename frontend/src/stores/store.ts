import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from './users/usersSlice';
import appointmentsSlice from './appointments/appointmentsSlice';
import interactionsSlice from './interactions/interactionsSlice';
import invoicesSlice from './invoices/invoicesSlice';
import leadsSlice from './leads/leadsSlice';
import reportsSlice from './reports/reportsSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    users: usersSlice,
    appointments: appointmentsSlice,
    interactions: interactionsSlice,
    invoices: invoicesSlice,
    leads: leadsSlice,
    reports: reportsSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
