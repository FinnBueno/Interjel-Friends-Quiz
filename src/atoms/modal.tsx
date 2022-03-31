import React from 'react';
import { Flex, FlexProps } from 'rebass';

export const Modal: React.FC<FlexProps & { isOpen: boolean }> = ({ isOpen, children, ...flex }) => {
    if (!isOpen) {
        return (<></>);
    }
    return (
        <Flex variant='modalBackground'>
            <Flex variant='modalContainer' {...flex}>
                {children}
            </Flex>
        </Flex>
    );
}