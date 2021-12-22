import logo from './logo.svg';
import './App.css';
import React from 'react';
import SideBar from './components/SideBar';
import { List, ListItem, Grid, Paper, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import AppBar from './components/AppBar';

const StyledPaperGreen = styled(Paper)({
    background: 'radial-gradient(115.28% 290.48% at 4.5% -15.43%, rgba(114, 238, 16, 0.67) 0%, #2F3A2B 22.92%, #30342E 56.77%, #323530 100%)',
    borderRadius: 15,
    boxShadow: '0px 4px 9px 2px rgba(0, 0, 0, 0.25)',
});

const StyledPaperRed = styled(Paper)({
  background: 'radial-gradient(115.28% 290.48% at 4.5% -15.43%, rgba(238, 16, 16, 0.67) 0%, #3A2B2B 22.92%, #342E2E 56.77%, #353030 100%)',
  borderRadius: 15,
  boxShadow: '0px 4px 9px 2px rgba(0, 0, 0, 0.25)',
});

function App() {
    return (
        <React.Fragment>
            <List sx={{display: 'flex', flexDirection:'row', margin: 0, padding: 0}}>
                <ListItem sx={{margin: 0, padding: 0, width: 'auto'}}>
                    <SideBar />
                </ListItem>
                <ListItem sx={{margin: 0, padding: 0, display: 'flex', flexDirection:'column', backgroundColor: 'black'}}>
                    <Grid item sx={{width: '100%'}}>
                        <AppBar />
                        <Paper sx={{backgroundColor: '#202C31', borderRadius: '10px', margin: '8px'}}>
                            <List sx={{height:'100%'}}>
                            <ListItemText sx={{color:'white'}}>News of the day</ListItemText>
                                <Grid container spacing={12} columns={16} sx={{marginBottom: '40px'}}>
                                    <Grid item lg={2} xl={2}/>
                                    <Grid item lg={4} xl={4}>
                                        <Paper className="paper" style={{width: '100%', height: 160}}></Paper>
                                    </Grid>
                                    <Grid item lg={4} xl={4}>
                                        <Paper className="paper" style={{width: '100%', height: 160}}></Paper>
                                    </Grid>
                                    <Grid item lg={4} xl={4}>
                                        <Paper className="paper" style={{width: '100%', height: 160}}></Paper>
                                    </Grid>
                                    <Grid item lg={2} xl={2}/>
                                </Grid>

                                <Grid container columns={16} spacing={16} alignItems="center" justify="center">
                                    <Grid item lg={3} xl={3} sm={3} md={3}/>
                                    <Grid item md>
                                        <StyledPaperGreen style={{ width: '100%', height: 160}} />
                                    </Grid>
                                    <Grid item md>
                                        <StyledPaperRed style={{ width: '100%', height: 160}} />
                                    </Grid>
                                    <Grid item lg={3} xl={3} sm={3} md={3}/>
                                </Grid>
                            </List>
                        </Paper>
                    </Grid>
                </ListItem>
            </List>
            {/*<Grid container>
                <Grid item lg={2} xl={2} height={'100%'}>
                    <SideBar />
                </Grid>

                <Grid item lg={10} xl={10}>
                </Grid>    
            </Grid>*/}
        </React.Fragment>
    );
}

export default App;
