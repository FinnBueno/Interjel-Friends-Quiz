import React from 'react';
import { Input as RebassInput, InputProps } from '@rebass/forms';
import { Flex, Text } from 'rebass';
import { useController, UseControllerProps } from 'react-hook-form';

export const Input: React.FC<InputProps & { label?: string, textAlign: string } & UseControllerProps<any>> = ({ children, label, ...rest }) => {
    const { field, fieldState } = useController(rest);
    return (
        <Flex flexDirection='column'>
            <Text variant='label' ml={1} mb={1}>
                {label || ''}
            </Text>
            <RebassInput variant='input' {...rest} {...field} >
                {children}
            </RebassInput>
            {fieldState.error?.type === 'validate'  ? <Text mt={1} variant='error'>{fieldState.error.message}</Text> : ''}
            {fieldState.error?.type === 'required'  ? <Text mt={1} variant='error'>{fieldState.error.message || 'This value is required'}</Text> : ''}
            {fieldState.error?.type === 'min'       ? <Text mt={1} variant='error'>{fieldState.error.message || `Number must be more than ${rest.rules?.min}`}</Text> : ''}
            {fieldState.error?.type === 'max'       ? <Text mt={1} variant='error'>{fieldState.error.message || `Number must be more than ${rest.rules?.max}`}</Text> : ''}
            {fieldState.error?.type === 'minLength' ? <Text mt={1} variant='error'>{fieldState.error.message || `${label} must have more than ${rest.rules?.minLength} characters`}</Text> : ''}
            {fieldState.error?.type === 'maxLength' ? <Text mt={1} variant='error'>{fieldState.error.message || `${label} must have less than ${rest.rules?.maxLength} characters`}</Text> : ''}
            {fieldState.error?.type === 'pattern'   ? <Text mt={1} variant='error'>{fieldState.error.message || `Please enter a valid ${label ? label.toLowerCase() : 'value'}`}</Text> : ''}
        </Flex>
    );
}