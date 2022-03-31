import React from 'react';
import { Button, ButtonProps } from 'rebass';
import styled, { keyframes } from 'styled-components';

const ripple = keyframes`
0% {
    transform: scale(1);
    opacity: 1;
}
50% {
    transform: scale(10);
    opacity: 0.375;
}
100% {
    transform: scale(35);
    opacity: 0;
}
`;

const RippleButton = styled(Button)`
overflow: hidden;
cursor: pointer;
position: relative;
& > .ripple {
    width: 20px;
    height: 20px;
    position: absolute;
    background: rgb(0, 0, 0, 0.3);
    display: block;
    content: "";
    border-radius: 9999px;
    opacity: 1;
    animation: 0.9s ease 1 forwards ${ripple};
}
& > .content {
    position: relative;
    z-index: 2;
}
`;

/**
 * This is a mobile first button component that displays a special ripple effect, commonly seen on mobile buttons
 * TODO: Make this a progressive button, being able to switch to a loading state through a prop
 */
export const MButton: React.FC<Omit<ButtonProps, 'onClick'> & { onClick?: (..._: any) => void }> = ({ children, onClick, disabled, ...rest }) => {

    const [coords, setCoords] = React.useState({ x: -1, y: -1 });
    const [isRippling, setIsRippling] = React.useState(false);

    React.useEffect(() => {
        if (coords.x !== -1 && coords.y !== -1) {
            setIsRippling(true);
            setTimeout(() => setIsRippling(false), 300);
        } else setIsRippling(false);
    }, [coords]);

    React.useEffect(() => {
        if (!isRippling) setCoords({ x: -1, y: -1 });
    }, [isRippling]);

    return (
        <RippleButton
            style={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'unset' : 'pointer',
            }}
            {...rest}
            onClick={(e: any) => {
                if (disabled) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                onClick && onClick(e);
            }}
        >
            {isRippling ? (
                <span
                    className="ripple"
                    style={{
                        left: coords.x,
                        top: coords.y
                    }}
                />
            ) : (
                ''
            )}
            <span className="content">{children}</span>
        </RippleButton>
    )
}