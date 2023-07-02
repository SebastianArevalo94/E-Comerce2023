import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
// import { useSelector } from "react-redux";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { CssBaseline } from "@mui/material";

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <Provider store={store}>
//     <ThemeProvider theme={theme}>
//       <CssBaseline/>
//       <AppRoutes />
//     </ThemeProvider>
//   </Provider>
// );
