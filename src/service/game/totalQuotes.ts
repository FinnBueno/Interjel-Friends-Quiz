import { useEffect, useState } from "react";
import firebase from "firebase";

export type Total = number;

const DEFAULT_TOTAL: Total = 100;

export const useTotal = () => {
    const [total, setTotal] = useState<Total>(DEFAULT_TOTAL);

    useEffect(() => {
        const handle = (snapshot: firebase.database.DataSnapshot) => {
            if (!snapshot.exists()) return;
            setTotal(snapshot.numChildren() || DEFAULT_TOTAL);
        };
        const ref = firebase.database().ref('facts');
        ref.once('value', handle);
    }, []);

    return total;
}