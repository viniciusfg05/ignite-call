import { styled, Heading, Text } from '@ignite-ui/react'

export const Container = styled('div', {
  maxWidth: 'calc(100vw - (100vw - 1168px) / 2)',
  marginLeft: 'auto',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  gap: '$20',
})

export const Here = styled('div', {
  maxWidth: '480px',

  [`> ${Heading}`]: {
    '@media (max-width: 600px)': {
      fontSize: '$6xl',
    },
  },

  [`> ${Text}`]: {
    marginTop: '$2',
    color: '$gray200',
  },
})

export const Previews = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media (max-width: 600px)': {
    display: 'none',
  },
})
