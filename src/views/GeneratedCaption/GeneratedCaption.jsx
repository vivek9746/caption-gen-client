
const GeneratedCaption = ({ caption }) => {
const captionTokens = caption.split(' ');

  return (
    <div>
        {
            captionTokens.map((token, index) => (
                <span key={index} style={{color: token.startsWith('#') ? ' #4c68d7' : 'black'}}>
                    {token}{' '}
                </span>
            ))
        }
    </div>
  )
}

export default GeneratedCaption