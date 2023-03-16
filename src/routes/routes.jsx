import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import DefaultLayout from "../components/defaultLayout/defaultLayout";
import { Home } from "./Home";


const router = createBrowserRouter([

    {
        path: "/",
        element: <DefaultLayout><Home /></DefaultLayout> ,
    },
]);

export default router