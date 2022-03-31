import { useEffect, useState } from "react";
import firebase from "firebase";

export type Game = {
    state: 'lobby' | 'playing' | 'finished';
    current?: {
        id: number;
        currentFact: 0 | 1 | 2;
        updatedAt: number;
        content: {
            name: string;
            0: number;
            1: number;
            2: number;
        }
    };
}

const DEFAULT_GAME_STATE: Game = { state: 'lobby' };

export const useGame = () => {
    const [game, setGame] = useState<Game>(DEFAULT_GAME_STATE);

    useEffect(() => {
        const handle = (snapshot: firebase.database.DataSnapshot) => {
            if (!snapshot.exists()) return;
            setGame(snapshot.val() || DEFAULT_GAME_STATE);
        };
        const ref = firebase.database().ref('game');
        ref.on('value', handle);
        return () => ref.off('value', handle);
    }, []);

    return game;
}