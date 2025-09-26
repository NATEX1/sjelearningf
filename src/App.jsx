import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./layouts/Main";
import Home from "./pages/Home";
import History from "./pages/History";
import Status from "./pages/Status";
import Lesson from "./pages/Lesson";
import Profile from "./pages/Profile";
import Exercise from "./pages/Exercise";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Main />}>
        <Route index element={<Home />} />
        <Route path="/lessons/:id" element={<Lesson />} />
        <Route path="/lessons/:id/exercises" element={<Exercise />} />
        <Route path="/history" element={<History />} />
        <Route path="/status" element={<Status />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
