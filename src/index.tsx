import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {store} from './Redux-store/Store';
import {AppWithRedux} from './AppWithRedux';


// import {createTheme, ThemeProvider} from "@material-ui/core";

// const theme = createTheme();

ReactDOM.render(<Provider store={store}>
        {/*<ThemeProvider theme={theme}>{<AppWithRedux/>}*/}
        {/*</ThemeProvider>;*/}
        <AppWithRedux/>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
