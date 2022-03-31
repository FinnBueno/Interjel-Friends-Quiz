import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { Flex, Heading } from "rebass";
import { SyncLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import { Player } from "src/service/game/player";

export type Auth = {
    admin: { // might remove this
        loading?: boolean;
        error?: boolean;
        isAdmin?: boolean;
        setLoading: (_: boolean) => void;
    }
    loading: boolean;
    error?: boolean;
    player?: Player;
    setPlayer: (_?: string) => void;
} | undefined;

export const AuthContext = React.createContext<Auth>({ admin: { setLoading: _ => {} }, loading: true, player: undefined, setPlayer: () => {} });

const PLAYER_IDENTIFIER_PATH = 'player_identifier'

export const AuthProvider: React.FC<{}> = (props) => {
    
    const [playerIdentifier, setPlayerIdentifier] = useState<string | undefined>(localStorage.getItem(PLAYER_IDENTIFIER_PATH) || undefined);

    const [player, setPlayer] = useState<Player | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [isAdmin, setAdmin] = useState<boolean>(false);
    const [adminLoading, setAdminLoading] = useState(true);
    const [adminError, setAdminError] = useState(false);

    useEffect(() => {
        const handle = (snapshot: firebase.database.DataSnapshot) => {
            console.log('Player info updated!');
            if (!snapshot.exists()) return;
            setPlayer(snapshot.val());
        };
        if (!playerIdentifier) return;
        const ref = firebase.database().ref(`players/${playerIdentifier}`);
        ref.on('value', handle);
        return () => ref.off('value', handle);
    }, [playerIdentifier]);

    const fetchInitialAuthState = () => {
        setLoading(true);
        // lookup the data of the player's locally stored uuid ("token")
        firebase.database().ref(`players/${playerIdentifier}`).once('value', snapshot => {
            setLoading(false);
            // save it to an auth object, or undefined if the player doesn't have any data on their uuid
            // (game might have restarted or they're newly joining)
            setPlayer(snapshot.exists() ? snapshot.val() : undefined);
        }, _ => {
            setLoading(false);
            setError(true);
        });
    }

    const authStateChanged = (user: firebase.User | null) => {
        setAdmin(!!user);
        setAdminLoading(false);
    }

    // fetch the initial auth state when we've retrieved our player uuid
    useEffect(fetchInitialAuthState, [playerIdentifier]);
    useEffect(() => {
        setAdminLoading(true);
        // this will run if we are officially authenticated, which means we're logged in as an admin (might not use this??) TODO
        firebase.app().auth().onAuthStateChanged(authStateChanged, () => setAdminError(true));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                player,
                setPlayer: (name) => {
                    setLoading(true);
                    if (name) {
                        const uuid = uuidv4();
                        localStorage.setItem(PLAYER_IDENTIFIER_PATH, uuid);
                        // create a player object in the database, then tell the client that they've 
                        firebase.app().database().ref(`players/${uuid}`).set({ name, uuid, score: 0 }).then(() => setPlayerIdentifier(uuid));
                    } else {
                        localStorage.removeItem(PLAYER_IDENTIFIER_PATH);
                        if (playerIdentifier) {
                            // remove player object from database in case this player had a name
                            firebase.app().database().ref(`players/${playerIdentifier}`).remove();
                        }
                        setPlayerIdentifier(undefined);
                    }
                },
                loading,
                error,
                admin: isAdmin ? {
                    loading: adminLoading,
                    error: adminError,
                    isAdmin,
                    setLoading: () => setAdminLoading(true),
                } : {
                    setLoading: () => setAdminLoading(true),
                },
            }}
        >
            {loading ? <LoadingPage /> : (
                error ? <ErrorPage /> : props.children
            )}
        </AuthContext.Provider>
    );
}

const ErrorPage: React.FC<{}> = () => (
    <Heading variant='heading1'>Error</Heading>
);

const LoadingPage: React.FC<{}> = () => (
    <Flex style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginTop: -40 / 2,
        marginLeft: -108 / 2,
    }} justifyContent='center' alignItems='center'>
        <SyncLoader size={32} loading />
    </Flex>
);

export const useAuth = () => useContext(AuthContext);
