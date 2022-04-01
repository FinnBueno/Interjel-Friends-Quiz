import React, { useEffect, useState } from 'react';
import { Flex, Heading, Text } from 'rebass';
import firebase from 'firebase/app';
import 'firebase/auth';
import { MButton } from 'src/atoms';
import { useAuth } from 'src/service/auth';
import { useGame } from 'src/service/game';
import { usePeople } from 'src/service/game/people';

export const PlayerPage: React.FC<{}> = () => {
    const auth = useAuth();
    const game = useGame();
    const people = usePeople();
    const [selection, setSelection] = useState<string | undefined>(undefined);
    const [selectionPersisted, setSelectionPersisted] = useState<boolean>(false);
    useEffect(() => {
        if (!selection) return;
        setSelectionPersisted(true);
        if (selection === game.current?.content.name) {
            let points = 0;
            if (game.current.currentFact === 0) {
                points = 1;
            } else if (game.current.currentFact === 1) {
                points = 3;
            } else {
                points = 2;
            }
            console.log(auth?.player);
            firebase.app().database().ref(`players/${auth?.player?.uuid}`).set({
                ...auth?.player,
                score: (auth?.player?.score || 0) + points
            });
            console.log('Adding score');
        }
        setSelection(undefined);
    }, [game.current?.currentFact]);
    useEffect(() => {
        setSelectionPersisted(false);
        setSelection(undefined);
    }, [game.current?.id])
    if (game.state === 'lobby') {
        return (
            <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
                <Heading variant='heading1' mb={1}>Even geduld</Heading>
                <Text variant='body' textAlign='center' mb={1}>We gaan zo beginnen.</Text>
                <Text variant='body' textAlign='center' mt={3}>Je naam is nu {auth?.player?.name}.</Text>
                <MButton variant='link' onClick={() => auth?.setPlayer()} mt={1}>Toch iets anders? Klik dan hier.</MButton>
            </Flex>
        );
    }
    if (game.state === 'finished') {
        return (
            <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
                <Heading variant='heading1' mb={1}>Dat was 't!</Heading>
                <Text variant='body' textAlign='center' mb={1}>Check het scherm voor de uitslag</Text>
            </Flex>
        );
    }
    if (selectionPersisted) {
        return (
            <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
                <Heading variant='heading1' mb={1}>Keuze gemaakt</Heading>
                <Text variant='body' textAlign='center' mb={1}>Kom je hier vaker?</Text>
            </Flex>
        );
    }
    return (
        <Flex flexDirection='column' justifyContent='stretch' height='100%' maxHeight='100vh'>
            <Flex flex={0} my={3} mx={2} flexDirection='column'>
                <Heading variant='heading3'>
                    Maak je keuze 🤔🦺
                </Heading>
                <Text variant='caption' mt={2}>Maak je keuze en laat de timer aflopen. Je kunt je keuze niet aanpassen wanneer er een nieuw feitje verschijnt!</Text>
                <Text variant='caption' mt={1}>Je ziet nu feit {game.current!.currentFact + 1} van persoon {game.current!.id + 1}</Text>
            </Flex>
            <Flex flex={1} flexDirection='row' overflow='scroll' mb={2} flexWrap='wrap'>
                {people.map(({ name, icon }) => (
                    <Flex width='50%' key={name} p={2}>
                        <Flex bg={selection === name ? 'success' : 'backgroundLighter'} width='100%' variant='cardClickable' onClick={() => setSelection(name)} flexDirection='column' alignItems='center'>
                            {/* <Image width='100%' height='auto' src={photo} alt='photo' style={{ objectFit: 'cover' }} /> */}
                            <Heading pt={1} mb={1} variant='heading4'>
                                {name}
                            </Heading>
                            <Heading variant='heading4' mb={2}>{icon}</Heading>
                        </Flex>
                    </Flex>
                ))}
            </Flex>
            <Flex flex={0} mx={2} mb={2}>
                <MButton variant='primaryLarge' width='100%' onClick={() => setSelectionPersisted(true)}>
                    Bevestig
                </MButton>
            </Flex>
        </Flex>
    );
}
