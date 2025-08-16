import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import socketSlice from "./SocketSlice";
import postSlice from "./postSlice";
import chatSlice from './chatSlice';
import rtnSlice from './rtnSlice';
import storySlice from './storySlice';
import reelSlice from './reelSlice';
import commentSlice from './commentSlice';

import messageNotificationReducer from "./messageNotificationSlice";

import { 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    auth: authSlice,
    post: postSlice,
    socketio: socketSlice,
    chat: chatSlice,
    realTimeNotification: rtnSlice,
    commentNotification: commentSlice, 
    messageNotification: messageNotificationReducer,
    story: storySlice,
    reel: reelSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;
