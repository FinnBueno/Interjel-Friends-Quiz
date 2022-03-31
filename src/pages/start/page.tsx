import React from 'react';
import { Flex, Heading, Text } from 'rebass';
import { useAuth } from 'src/service/auth';
import { Input, MButton } from 'src/atoms';
import { SubmitHandler, useForm } from 'react-hook-form';

type NameInput = {
    playerName: string;
}

export const StartPage: React.FC<{}> = () => {
    const auth = useAuth();
    // const history = useHistory();
    // const goToAdmin = () => history.push('/admin');
    const { register, handleSubmit, control } = useForm<NameInput>({ defaultValues: { playerName: '' } });
    const onSubmit: SubmitHandler<NameInput> = data => auth?.setPlayer(data.playerName);
    return (
        <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
            <Heading variant='heading1' mb={1}>Wie ben jij?</Heading>
            <Text variant='body' textAlign='center' mb={1}>Voer even een leuke naam in</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    control={control}
                    type='text'
                    width='100%'
                    textAlign='center'
                    {...register(
                        'playerName',
                        {
                            required: true,
                            maxLength: 20
                        }
                    )}
                />
                <MButton type='submit' mt={2} variant='primary' py={2} px={3} width='100%'>Neem deel</MButton>
            </form>
        </Flex>
    )
}