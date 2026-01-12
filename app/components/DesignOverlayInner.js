export default function DesignOverlayInner({ id, op, top }) {

    return (
        <div id='overlay'>
            <div style={{
                position: 'absolute',
                top: top,
                left: 0,
                opacity: op
            }}>
                <img src={`./artboards/${id}.png`}
                    style={{
                        width: '100%'
                    }}
                />
            </div>
        </div>
        
    )
}