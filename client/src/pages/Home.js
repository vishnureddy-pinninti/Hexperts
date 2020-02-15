import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TopBar from '../components/base/TopBar';
import QACard from '../components/base/Card';
import Drawer from '../components/base/Drawer';
import { requestUserQuestions } from '../store/actions/questions';

function Home(props) {
    const [
        open,
        setOpen,
    ] = React.useState(false);

    const { requestUserQuestions } = props;

    useEffect(() => {
        // Update the document title using the browser API
        requestUserQuestions();
      });

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
        </div>
    );
}

const mapStateToProps = (state) => {
    return {

    }
};

const mapDispatchToProps = dispatch => {
    return {
        requestUserQuestions: () => {
            dispatch(requestUserQuestions());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
