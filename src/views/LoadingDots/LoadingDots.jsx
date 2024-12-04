import React from 'react'

const LoadingDots = () => {
const [text, setText] = React.useState('Generating')
setInterval(() => {
    if(text === 'Generating...') {
        setText('Generating');
    }
    setText((text) => text === 'Generating' ? 'Generating.' : text === 'Generating.' ? 'Generating..' : 'Generating...')
}, 1000)
  return (
    <div>{text}</div>
  )
}

export default LoadingDots