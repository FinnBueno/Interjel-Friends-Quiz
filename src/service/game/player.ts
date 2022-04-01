import { useEffect, useState } from "react";
import firebase from "firebase";

export type Player = {
    uuid: string;
    name: string;
    score: number;
}

export const usePlayers = () => {
    const [players, setPlayers] = useState<Player[]>();

    useEffect(() => {
        const handle = (snapshot: firebase.database.DataSnapshot) => {
            if (!snapshot.exists()) return;
            const result: Player[] = Object.values(snapshot.val()).filter(t => typeof t === 'object' && t) as Player[];
            setPlayers(result.sort((a, b) => b.score - a.score));
        };
        const ref = firebase.database().ref('players');
        ref.on('value', handle);
        return () => ref.off('value', handle);
    }, []);

    return players;
}