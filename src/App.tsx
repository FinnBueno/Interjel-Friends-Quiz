import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import { ToastContainer } from 'react-toastify';
import { LoadingBar } from './molecules';
import { GlobalStyle, theme } from './service/theme/configuration';
import { PageManager } from 'src/pages/router';
import { AuthProvider } from 'src/service/auth';

const App: React.FC<{}> = () => (
    <Router>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ToastContainer
                position='bottom-right'
                autoClose={1750}
                draggablePercent={50}
                hideProgressBar
            />
            <LoadingBar />
            <AuthProvider>
                {/* <VotesProvider> */}
                {/* <GameProvider> */}
                {/* <ScoreProvider> */}
                <PageManager />
                {/* </ScoreProvider> */}
                {/* </GameProvider> */}
                {/* </VotesProvider> */}
            </AuthProvider>
        </ThemeProvider>
    </Router>
)

export default App;
