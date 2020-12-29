// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';


// const persistConfig = {
//     key: 'root',
//     storage,
//     whitelist: ['auth']
// }


const initialState = {};

const middleware = [thunk];

const store = createStore(
    // persistReducer(persistConfig, rootReducer),
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

// let persistor = persistStore(store)

// export { store, persistor };
export { store };
