import Head from "next/head";

export function MainLayout({children, title='Initiative Urheberrecht, AT'}) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content='Die „Initiative Urheberrecht Österreich“ ist ein Zusammenschluss von österreichischen Künstler:innen-Vereinigungen (Urheber:innen und ausübende Künstler:innen), der sich für eine Verbesserung der gesetzlichen Rahmenbedingungen im Bereich des Urheber(vertrags)rechts und Verwertungsgesellschaftenrechts in Österreich einsetzt. Die Initiative erarbeitet insbesondere Vorschläge zur Stärkung der typischerweise schwächeren Verhandlungsposition der Kunstschaffenden gegenüber ihren Vertragspartnern (Verlage, Labels, Filmproduzent:innen, Rundfunkanstalten, sonstige Verwerter:innen) und zur Verbesserung der Vergütungssituation von Künstlerinnen und Künstlern in Österreich.'/>
                <meta property="og:image" content="/thumbnail.jpeg" />
                <meta charSet="utf-8"/>
            </Head>
            <main>
                {children}
            </main>
        </>
    )
}