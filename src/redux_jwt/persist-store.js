import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage/session";
import { persistReducer } from "redux-persist";

// 1. npm install —-save redux-persist
// 2. npm install —-save @reduxjs/toolkit

const persistConfig = {
    key: "root",
    storage,
};

function reducer(currentState, action) {
    if (currentState == undefined) {
        return ({
            Authorization: '',
            UserId: ''
        })
    }
    const newState = { ...currentState };
    switch (action.type) {
        case "NEWTOKEN": newState.Authorization = action.data; break;
        case "USERID": newState.UserId = action.data;
    }
    return newState;
}

const persistedReducer = persistReducer(persistConfig, reducer);


//configureStore에 있는 reducer는 configureStore의 메소드 이다. 위에 만든 함수 reducer 아님!!
const store = configureStore({
    reducer: persistedReducer,
});

export default store;