import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import { Box } from "rebass";
import styled, { keyframes } from "styled-components";
import { theme } from "src/service/theme/configuration";

const Line = styled(Box)`
position: absolute;
opacity: 0.4;
background: ${theme.colors.primary};
width: 150%;
height: 5px;
`;

const increase = keyframes`
from { left: -5%; width: 5%; }
to { left: 130%; width: 100%;}
`;

const decrease = keyframes`
from { left: -80%; width: 80%; }
to { left: 110%; width: 10%;}
`;

const Inc = styled(Box)`
animation: ${increase} 2s infinite;
position: absolute;
background: ${theme.colors.primary};
height: 5px;
opacity: 1;
`;

const Dec = styled(Box)`
animation: ${decrease} 2s 0.5s infinite;
position: absolute;
background: ${theme.colors.primary};
height: 5px;
opacity: 1;
`;

// TODO: Find out how to track any promise, no matter the label
export const LoadingBar = () => {
    const { promiseInProgress } = usePromiseTracker();

    if (!promiseInProgress) return (<></>);

    return (
        <Box style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            overflowX: 'hidden',
            height: '5px',
            zIndex: 10000
        }}>
            <Line />
            <Inc />
            <Dec />
        </Box>
    );
};