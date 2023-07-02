import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import { setTheme } from "./redux/themeSlice";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

const App = () => {
    const themeState = useSelector((store) => store.theme);
    const dispatch = useDispatch();
    useEffect(() => {
        let theme = localStorage.getItem('theme');
        if (!theme) {
            localStorage.setItem('theme', 'light')
        } else {
            dispatch(setTheme(theme))
        }
    })

    return (
        <ThemeProvider theme={themeState.isDark ? darkTheme : lightTheme}>
            <CssBaseline />
            <AppRoutes />
        </ThemeProvider>
    );
};

export default App;
