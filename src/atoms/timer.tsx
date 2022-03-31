import React, { useEffect } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { theme } from 'src/service/theme/configuration';

export const Timer: React.FC<{ timer: number; setTimer: (_: number) => void, duration: number; onComplete: () => void }> = ({ timer, setTimer, duration, onComplete }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (timer >= duration) {
                onComplete();
            } else {
                setTimer(timer+1);
            }
        }, 1000);
        return () => clearTimeout(timeout);
    });

    return (
        <CircularProgressbar
            value={timer}
            maxValue={duration}
            text={`${timer}`}
            styles={buildStyles({
                strokeLinecap: 'round',
                textSize: '32px',
                textColor: theme.colors.text,
                pathTransitionDuration: 1.2,
                trailColor: 'transparent',
                pathColor: theme.colors.primary,
                backgroundColor: 'transparent,'
            })}
        />
    )
}