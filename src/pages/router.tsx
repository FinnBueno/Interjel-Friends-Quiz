import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Flex } from 'rebass';
import { AuthenticatedRoute, UnauthenticatedRoute } from 'src/service/auth';
import { HostPage } from 'src/pages/host';
import { PlayerPage } from 'src/pages/player';
import { StartPage } from 'src/pages/start';

export const PageManager: React.FC<{}> = () => {
    const location = useLocation();
    return (
        <Flex justifyContent='center' width='100%' height='auto' minHeight='100%'>
            <Flex flexDirection='column' width='100%' height='auto' minHeight='100%'>
                <Switch location={location}>
                    <Route path='/host' component={HostPage} />
                    <AuthenticatedRoute path='/player' component={PlayerPage} />
                    <UnauthenticatedRoute path='/' component={StartPage} />
                </Switch>
            </Flex>
        </Flex>
    );
};
