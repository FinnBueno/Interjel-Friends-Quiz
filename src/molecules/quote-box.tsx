import React from 'react';
import { Flex, FlexProps, Heading } from 'rebass';

export const QuoteBox: React.FC<FlexProps & { text?: string }> = ({ children, text, ...rest }) => (
    <Flex p={1} {...rest}>
        <Heading textAlign='center' variant={text || 'heading3'}>{children || 'Placeholder quote'}</Heading>
    </Flex>
)