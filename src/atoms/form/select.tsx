import React from 'react';
import { Select as RebassSelect, SelectProps } from '@rebass/forms';
import { Flex, Text } from 'rebass';

export const Select: React.FC<SelectProps & { label: string }> = ({ children, label, ...rest }) => (
    <Flex flexDirection='column'>
        <Text variant='label' ml={1} mb={1}>
            {label}
        </Text>
        <RebassSelect {...rest}>
            {children}
        </RebassSelect>
    </Flex>
);
