import { useEffect, useState } from "react";
import firebase from "firebase";

export type People = { name: string; icon: string }[];

export const usePeople = () => {
    const [people, setPeople] = useState<People>([]);

    useEffect(() => {
        const handle = (snapshot: firebase.database.DataSnapshot) => {
            if (!snapshot.exists()) return;
            const names = (snapshot.val() as any[]).map(({ name, icon }) => {
                return { name, icon };
            });
            setPeople(names.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
        };
        const ref = firebase.database().ref('facts');
        ref.on('value', handle);
        return () => ref.off('value', handle);
    }, []);

    return people;
}