import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Generator from './pages/Generator';

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import EmptyLectureHalls from './pages/EmptyLectureHalls';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <Navbar />
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<Generator />} />
                        <Route path="/empty-halls" element={<EmptyLectureHalls />} />
                    </Routes>
                </main>
                <footer>
                    <Footer />
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
