import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="App">
            Home Screen
            <Link to="/test">Test Link</Link>
        </div>
    );
}

export default Home;
