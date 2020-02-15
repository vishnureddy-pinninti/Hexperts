import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/base/TopBar';
import QACard from '../components/base/Card';
import Drawer from '../components/base/Drawer';

function Home() {
    const [
        open,
        setOpen,
    ] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <div className="App">
            <TopBar handleDrawerOpen={ handleDrawerOpen } />
            <Drawer
                open={ open }
                handleDrawerClose={ handleDrawerClose } />
            <div style={ {
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: '#f5f5f5',
            } }>
                <QACard
                    author="Karthik Kosigi"
                    time="September 14, 2016" />
                <QACard
                    author="Tanmoy"
                    time="September 14, 2016" />
                <QACard
                    author="Reddaih Challa"
                    time="September 14, 2016" />
                <QACard
                    author="Karthik Kosigi"
                    time="September 14, 2016" />
            </div>
            <Link to="/test">Test Link</Link>
        </div>
    );
}

export default Home;
