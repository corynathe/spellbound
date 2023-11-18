import React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import './App.css';

import { Home } from './Home';
import { WordList } from './WordList';
import { WordListTest } from './WordListTest';
import { UserEdit } from './UserEdit';
import { DictionaryTest } from './DictionaryTest';

export default function App() {
    return (
            <div>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="wordlist" element={<WordList />} />
                        <Route path="wordlist/:id" element={<WordList />} />
                        <Route path="wordlist/:id/test" element={<WordListTest />} />
                        <Route path="user/:id" element={<UserEdit />} />
                        <Route path="dictionary" element={<Dictionary />} />
                        <Route path="about" element={<About />} />
                        <Route path="*" element={<NoMatch />} />
                    </Route>
                </Routes>
            </div>
    );
}

function Layout() {
    return (
            <div className="App">
                {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
                <Outlet />
            </div>
    );
}

function About() {
    return (
            <div>
                <h2>About</h2>
            </div>
    );
}

function Dictionary() {
    return (
            <div>
                <DictionaryTest />
            </div>
    );
}

function NoMatch() {
    return (
            <div>
                <h2>Nothing to see here!</h2>
                <p>
                    <Link to="/">Go to the home page</Link>
                </p>
            </div>
    );
}