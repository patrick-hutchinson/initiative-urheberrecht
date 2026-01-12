export default function Slogan({ firstPhrase, secondPhrase, thirdPhrase }) {
    return (
        <section className='slogan'>
            <div className='slogan-phrase'>
                <div><h3>{firstPhrase.intro}</h3></div>
                <div><h1 className="scalable">{firstPhrase.accent}</h1></div>
            </div>
            <div className='slogan-phrase'>
                <div><h3>{secondPhrase.intro}</h3></div>
                <div><h1 className="scalable">{secondPhrase.accent}</h1></div>
            </div>
            <div className='slogan-phrase'>
                <div><h3>{thirdPhrase.intro}</h3></div>
                <div><h1 className="scalable">{thirdPhrase.accent}</h1></div>
            </div>
        </section>
    )
}

