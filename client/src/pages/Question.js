import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TopBar from '../components/base/TopBar';
import Drawer from '../components/base/Drawer';
import Questions from '../components/base/Questions';
import QuestionSection from '../components/base/QuestionSection';
import Answer from '../components/base/Answer';

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
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 8 }>
                        <QuestionSection />
                        <Answer
                            author="Karthik Kosigi"
                            time="September 14, 2016" />
                        <Answer
                            author="Challa Reddiah"
                            time="September 14, 2016" />
                        <Answer
                            author="Umakanth"
                            time="September 14, 2016" />
                        <Answer
                            author="Karthik Kosigi"
                            time="September 14, 2016" />
                        <Answer
                            author="Tanmoy Chakraborthy"
                            time="September 14, 2016" />
                    </Grid>
                    <Grid
                        item
                        xs={ 4 }>
                        <Questions title="Related Questions" />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default Home;
