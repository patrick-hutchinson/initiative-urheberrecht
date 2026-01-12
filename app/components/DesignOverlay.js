export default function DesignOverlay({ id, op }) {

    return (
        <div id='overlay'>
            <div style={{
                position: 'absolute',
                top: 0,
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