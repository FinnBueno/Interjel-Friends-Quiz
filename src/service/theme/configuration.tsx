import { createGlobalStyle } from 'styled-components';

const darkTheme = {
    background: '#18121E',
    backgroundLight: '#201827',
    primary: '#4A8744',
    primaryLighter: '#8Aa774',
    secondary: '#7a6724',
    text: '#FAFAFA',
    error: '#C82D2B',
    success: '#4A8744',
};

const colors = darkTheme;

const appBarHeight = (add = 0) => `${60 + add}px`;
const headerHeight = (add = 0) => `${66 + add}px`;

const customTheme = {
    colors,
    breakpoints: ['350px', '480px', '760px', '1024px', '1200px'],
    fonts: {
        // TODO: Use different fonts maybe?
        body: 'Montserrat, sans-serif',
        fantasy: 'MedievalSharp, Montserrat, sans-serif',
        heading: 'Montserrat, sans-serif',
        button: 'Montserrat, sans-serif',
    },
    text: {
        body: {
            fontFamily: 'body',
            fontWeight: 550,
            color: 'text',
        },
        title: {
            variant: 'text.body',
            fontSize: '20px',
        },
        caption: {
            variant: 'text.body',
            fontSize: '13px',
            opacity: .85,
        },
        label: {
            variant: 'text.body',
            fontSize: '14px',
            opacity: .55,
            fontWeight: 600,
        },
        error: {
            variant: 'text.body',
            fontSize: '13px',
            color: 'error',
        },
        heading1: {
            fontFamily: 'fantasy',
            fontWeight: 700,
            color: 'text',
            fontSize: '44px',
        },
        heading2: {
            variant: 'text.heading1',
            fontFamily: 'heading',
            fontSize: '32px',
        },
        heading3: {
            variant: 'text.heading2',
            fontSize: '26px',
            fontWeight: 600,
        },
        heading4: {
            variant: 'text.heading3',
            fontSize: '20px',
        }
    },
    buttons: {
        primary: {
            bg: 'primary',
            fontWeight: 600,
            outline: 'none',
            // TODO: Set loading indicator colour
        },
        primaryLarge: {
            bg: 'primary',
            fontWeight: 600,
            outline: 'none',
            fontSize: '24px',
            // TODO: Set loading indicator colour
        },
        secondary: {
            variant: 'primary',
            bg: 'secondary',
            fontWeight: 600,
        },
        hollow: {
            variant: 'buttons.primary',
            bg: 'transparent',
            color: 'primary',
            borderColor: 'primary',
            borderWidth: '2px',
            borderStyle: 'solid',
        },
        'secondary-hollow': {
            variant: 'buttons.hollow',
            color: 'secondary',
            borderColor: 'secondary',
        },
        'social-google': {
            variant: 'primary',
            bg: '#dd4b39',
            color: 'white',
            fontWeight: 600,
        },
        link: {
            bg: 'transparent',
            color: 'text',
            padding: 0,
            margin: 0,
            textDecoration: 'underline',
        },
        icon: {
            margin: 0,
            bg: 'transparent',
            outline: 'none',
            p: 2
        },
    },
    forms: {
        input: {
            outline: 'none',
            borderWidth: '0 0 2px 0',
            borderColor: 'backgroundLight',
            bg: 'rgb(0, 0, 0, 0.2)',
            borderRadius: '5px 5px 0 0',
            color: 'text',
            fontSize: '15px',
            fontWeight: 550,
            transition: 'border 300ms ease-out',
            '&:focus': {
                borderColor: 'primary',
            }
        },
        select: {
            borderColor: 'backgroundLight',
            bg: 'rgb(0, 0, 0, 0.2)',
            borderWidth: '2px',
            borderRadius: '5px',
            color: 'text',
            fontWeight: 550,
            outline: 'none',
            transition: 'border 300ms ease-out',
            '&:focus': {
                borderColor: 'primary',
            },
            '& + svg': {
                fill: 'secondary'
            }
        }
    },
    variants: {
        card: {
            bg: 'backgroundLight',
            boxShadow: 'rgb(0, 0, 0, .4) 0px 10px 13px -7px, 5px 5px 15px 5px rgba(0,0,0,0)',
            transition: 'transform .2s, opacity .2s',
            opacity: 1,
            '&:active': {
                transform: 'translateY(6px)'
            },
            'userSelect': 'none',
        },
        cardClickable: {
            variant: 'variants.card',
            cursor: 'pointer',
        },
        cardDisabled: {
            variant: 'variants.card',
            cursor: 'default',
            opacity: .5,
            '&:active': {
                transform: 'none',
            }
        },
        appBarFrame: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: appBarHeight(),
            bg: 'backgroundLight',
            boxShadow: '0px 10px 13px -7px #000000, 0px -3px 12px 3px rgba(0,0,0,0.2)'
        },
        headerFrame: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: headerHeight(),
            zIndex: 1000,
        },
        modalBackground: {
            bg: 'rgba(0, 0, 0, 0.6)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
        },
        modalContainer: {
            bg: 'background',
            position: 'relative',
            margin: 'auto',
            maxWidth: '1000px',
            borderRadius: '3px',
        }
    }
}

const containers: {[key: string]: any} = {
    center: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        maxWidth: '1200px',
        mx: 'auto',
    },
    appBarPadding: {
        marginBottom: appBarHeight()
    },
    headerPadding: {
        marginTop: headerHeight()
    }
}

const containerKeys = Object.keys(containers);

containerKeys.forEach(key1 => {
    containerKeys.forEach(key2 => {
        if (key1 === key2) return;
        if (containers[key2 + '-' + key1]) return;

        containers[key1 + '-' + key2] = {
            ...containers[key1],
            ...containers[key2],
        }
    })
})

customTheme.variants = {
    ...customTheme.variants,
    ...containers,
}


export const GlobalStyle = createGlobalStyle`
    html, body {
        background-color: ${darkTheme.background};
        margin: 0;
    }
    div.firebase-emulator-warning {
        display: none;
    }
`;

export const theme = {
    ...customTheme,
}
