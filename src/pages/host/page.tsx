// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Box, Flex, Heading, Text } from 'rebass';
import firebase from 'firebase/app';
import 'firebase/auth';
import _ from 'lodash';
import { FaForward, FaSortAmountUp, FaTrash } from 'react-icons/fa';
import { MButton, ProgressButton, Timer } from 'src/atoms';
import { useAuth } from 'src/service/auth';
import { signInWithGoogle } from 'src/service/firebase';
import { theme } from 'src/service/theme/configuration';
import { Modal } from 'src/atoms/modal';
import { useGame, usePlayers } from 'src/service/game';
import styled from 'styled-components';

const BackgroundEffect = styled(Box)`
    position: absolute;
    width:100%;
    height: 100%;
    z-index:0;
    overflow:hidden;
    top:0;
    left:0;
    pointer-events: none;
    & > div {
        position: absolute;
        bottom:-100px;
        pointer-events: none;
        width:40px;
        height: 40px;
        background:${theme.colors.primary};
        border-radius:50%;
        opacity:0.5;
        animation: rise 10s infinite ease-in;
    }
    & > div:nth-child(1) {
        width:40px;
        height:40px;
        left:10%;
        animation-duration:8s;
    }
    & > div:nth-child(2){
        width:20px;
        height:20px;
        left:20%;
        animation-duration:5s;
        animation-delay:1s;
    }
    & > div:nth-child(3){
        width:50px;
        height:50px;
        left:35%;
        animation-duration:7s;
        animation-delay:2s;
    }
    & > div:nth-child(4){
        width:80px;
        height:80px;
        left:50%;
        animation-duration:11s;
        animation-delay:0s;
    }
    & > div:nth-child(5){
        width:35px;
        height:35px;
        left:55%;
        animation-duration:6s;
        animation-delay:1s;
    }
    & > div:nth-child(6){
        width:45px;
        height:45px;
        left:65%;
        animation-duration:8s;
        animation-delay:3s;
    }
    & > div:nth-child(7){
        width:90px;
        height:90px;
        left:70%;
        animation-duration:12s;
        animation-delay:2s;
    }
    & > div:nth-child(8){
        width:25px;
        height:25px;
        left:80%;
        animation-duration:6s;
        animation-delay:2s;
    }
    & > div:nth-child(9){
        width:15px;
        height:15px;
        left:70%;
        animation-duration:5s;
        animation-delay:1s;
    }
    & > div:nth-child(10){
        width:90px;
        height:90px;
        left:25%;
        animation-duration:10s;
        animation-delay:4s;
    }
    @keyframes rise{
        0%{
            bottom:-100px;
            opacity: .75;
            transform:translateX(0);
        }
        50% {
            opacity: 0;
        }
        100%{
            opacity: 0;
            bottom: 100vh;
        }
    }
`;

export const HostPage: React.FC<{}> = () => {
    const auth = useAuth();
    const history = useHistory();
    const game = useGame();
    const players = usePlayers() || [];
    const [timer, setTimer] = useState<number>(0);
    const [showScoreboardModal, setShowScoreboardModal] = useState(false);
    const [finalRevealCounter, setFinalRevealCounter] = useState(0);
    const backToStart = () => history.push('/');

    if (!auth?.admin.isAdmin && !auth?.admin.loading) {
        return (
            <Flex variant='center-container' mt={3} alignItems='center' flexDirection='column'>
                <ProgressButton
                    mb={2}
                    variant='social-google'
                    scope='sign-in'
                    onClick={(e) => {
                        e.preventDefault();
                        trackPromise(
                            signInWithGoogle(),
                            'sign-in'
                        )
                    }}
                >
                    Login als host
                </ProgressButton>
                <MButton variant='link' onClick={backToStart} p={2}>
                    Terug naar speler scherm
                </MButton>
            </Flex>
        )
    }

    const reset = () => firebase.app().database().ref('game').set({ state: 'lobby' });

    // go from lobby state to playing state
    const start = () => {
        // shuffle the facts list
        const db = firebase.app().database();
        const factsRef = db.ref('facts');
        factsRef.once('value').then(snapshot => {
            const shuffled = _.shuffle(snapshot.val());
            factsRef.set(shuffled)
                .then(() => {
                    firebase.app().database().ref('game').set({
                        state: 'playing',
                        current: {
                            id: 0,
                            currentFact: 0,
                            updatedAt: Date.now(),
                            content: shuffled[0]
                        }
                    });
                })
                .catch((e) => {
                    console.error(e);
                    toast(
                        'Is iets fout gegaan.',
                        { type: 'error' }
                    );
                })
        });
    }

    const next = () => {
        if (game.current!.currentFact >= 2) {
            if (game.current!.id >= 19) {
                // finish game
                firebase.app().database().ref('game/state').set('finished');
            }
            // move to next person
            const db = firebase.app().database();
            const factsRef = db.ref('facts');
            factsRef.once('value').then(snapshot => {
                // TODO: Pause the game before new person is selected
                const facts = snapshot.val();
                const newId = (game.current?.id || 0) + 1;
                firebase.app().database().ref('game/current').set({
                    id: newId,
                    currentFact: 0,
                    updatedAt: Date.now(),
                    content: facts[newId]
                }).then(() => setTimer(0));
            });
        } else {
            // move to next fact
            firebase.app().database().ref('game/current').set({
                ...game.current,
                updatedAt: Date.now(),
                currentFact: game.current!.currentFact + 1,
            }).then(() => setTimer(0));
        }
    }

    if (game.state === 'lobby') {
        return (
            <Flex variant='center' flexDirection='column' alignItems='center' justifyContent='stretch' height='100%' minHeight='auto'>
                <BackgroundEffect>
                    {Array.from(Array(10).keys()).map(_ => (
                        <Box />
                    ))}
                </BackgroundEffect>
                <Flex flex={1} alignItems='center'>
                    <Heading variant='heading1'>
                        ⏰ We wachten ⏰
                    </Heading>
                </Flex>
                <Flex flex={3} alignItems='center' justifyContent='center' maxWidth='800px' flexWrap='wrap' width='100%'>
                    {players.map(player => (
                        <Flex flex={1} justifyContent='center' minWidth='20%'>
                            <Heading variant='heading3' key={player.uuid}>
                                {player.name}
                            </Heading>
                        </Flex>
                    ))}
                </Flex>
                <Flex mb={4}>
                    <MButton px={4} variant='primaryLarge' onClick={start}>
                        Start
                    </MButton>
                </Flex>
            </Flex>
        );
    }

    if (game.state === 'finished') {
        return (
            <Flex variant='center' flexDirection='column' alignItems='center' justifyContent='stretch' height='100%' minHeight='auto'>
                <BackgroundEffect>
                    {Array.from(Array(10).keys()).map(_ => (
                        <Box />
                    ))}
                </BackgroundEffect>
                <Flex flex={3} alignItems='center' justifyContent='center' maxWidth='800px' flexDirection='column'>
                    <Heading mb={4} variant='heading1'>
                        De uitslag!
                    </Heading>
                    <Flex flexDirection='column' width='700px' mb={2}>
                        {players?.slice(0, 5).map((player, index) => (
                            <Flex
                                justifyContent='space-between'
                                key={player.uuid}
                                bg='backgroundLight'
                                mb={1} py={3} px={3}
                                onClick={() => setFinalRevealCounter(finalRevealCounter + 1)}
                                style={{
                                    cursor: 'pointer'
                                }}
                            >
                                <Heading variant='heading3' opacity={(index >= (5 - finalRevealCounter)) ? 1 : 0}>
                                    {findMedal(index)} {player.name}
                                </Heading>
                                <Heading variant='heading3'>
                                    {player.score}
                                </Heading>
                            </Flex>
                        ))}
                    </Flex>
                    <MButton variant='primaryLarge' px={4} onClick={reset} mt={3}>
                        Reset
                    </MButton>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex variant='center' flexDirection='column' alignItems='center' justifyContent='stretch' height='100%' minHeight='auto'>
            <BackgroundEffect>
                {Array.from(Array(10).keys()).map(_ => (
                    <Box />
                ))}
            </BackgroundEffect>
            <Modal isOpen={showScoreboardModal} p={3}>
                <Flex flexDirection='column' m={2} alignItems='center'>
                    <Heading variant='heading1' mb={1}>
                        💯 Skorebort 💯
                    </Heading>
                    <Flex flexDirection='column' width='700px' mb={2}>
                        {players?.slice(0, 5).map(player => (
                            <Flex justifyContent='space-between' key={player.uuid} bg='backgroundLight' mb={1} py={2} px={3}>
                                <Heading variant='heading3'>
                                    {player.name}
                                </Heading>
                                <Heading variant='heading3'>
                                    {player.score}
                                </Heading>
                            </Flex>
                        ))}
                    </Flex>
                    <Flex justifyContent='flex-end'>
                        <MButton onClick={() => setShowScoreboardModal(false)} variant='primary'>Sluiteh</MButton>
                    </Flex>
                </Flex>
            </Modal>
            <Flex flex={1} justifyContent='flex-end' alignItems='center' flexDirection='column'>
                <Heading variant='heading4' mb={2}>
                    Persoon {game.current!.id + 1} van de 20
                </Heading>
                <Heading variant='heading3' mb={4}>
                    Feit {(game.current?.currentFact || 0) + 1}
                </Heading>
                <Box width='150px' mb={4} height='150px'>
                    {game.current!.currentFact < 2 ? 
                        <Timer timer={timer} setTimer={setTimer} duration={30} onComplete={next} /> : 
                        <Text fontSize='100px'>
                            🤔
                        </Text>
                    }
                </Box>
            </Flex>
            <Flex flex={1} alignItems='center'>
                <Heading variant='heading1' textAlign='center' px={4}>
                    {game.current?.content[game.current.currentFact] || `Dit persoon heeft nog geen feit nummer ${(game.current?.currentFact || 0) + 1}`}
                </Heading>
            </Flex>
            <Flex flex={1} flexDirection='column' alignItems='center' justifyContent='space-between' width='100%' style={{ zIndex: 1 }}>
                <Heading variant='heading2' mt={4} verticalAlign='center'>
                    {getEmoji(game.current!.currentFact)} {3-(game.current?.currentFact || 0)} {game.current!.currentFact === 2 ? 'punt' : 'punten'} {getEmoji(game.current!.currentFact)}
                </Heading>
                <Flex width='100%' p={2} bg='backgroundLight' justifyContent='center'>
                    <Flex maxWidth='800px' width='100%' justifyContent='space-between'>
                        <MButton mr={2} onClick={reset}>
                            <FaTrash />
                        </MButton>
                        <MButton variant='primary' onClick={() => setShowScoreboardModal(true)}>
                            <FaSortAmountUp />
                        </MButton>
                        <MButton mr={2} onClick={next}>
                            <FaForward />
                        </MButton>
                    </Flex>
                </Flex>
            </Flex>

        </Flex>
    )
}
function getEmoji(id: 0 | 1 | 2): string {
    if (id === 0) {
        return '🍆';
    } else if (id === 1) {
        return '🍑';
    } else {
        return '🤡';
    }
}

function findMedal(index: number): string {
    return ['🥇', '🥈', '🥉', '🤡', '🤡'][index];
}

