import { set } from "lodash";
import { useState, useEffect, useRef } from "react";

export default function ContactForm() {
    const [anrede, setAnrede] = useState("");
    const anredeRef = useRef(null);
    const vornameRef = useRef(null);
    const nachnameRef = useRef(null);
    const emailRef = useRef(null);
    const [checkbox, setCheckbox] = useState(false);

    const [state, setState] = useState(0); // 0 - initial, 1 - loading, 2 - success, 3 - error
    const [errorMsg, setErrorMsg] = useState("");

    const checkSubscriptionStatus = async (email) => {
        const response = await fetch(`/api/check-subscription?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        return data.status;
    };


    const subscribe = async (e) => {
        e.preventDefault();
        setState(1);
        setErrorMsg("");

        const email = emailRef.current.value;

        const subscriptionStatus = await checkSubscriptionStatus(email);
        if (subscriptionStatus === 'subscribed') {
            setState(3);
            setErrorMsg("Diese E-Mail Adresse ist bereits abonniert.");
            return; 
        }

        const payload = {
            anrede: anredeRef.current.value.charAt(0).toUpperCase() + anredeRef.current.value.slice(1),
            vorname: vornameRef.current.value.charAt(0).toUpperCase() + vornameRef.current.value.slice(1),
            nachname: nachnameRef.current.value.charAt(0).toUpperCase() + nachnameRef.current.value.slice(1),
            email: email,
            checkbox: checkbox,
        };

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setState(2);
        } catch (error) {
            setErrorMsg(error.message);
            setState(3);
        }
    };

    const anredeChange = (e) => {
        setAnrede(e.target.value);
        e.target.value === '' ? anredeRef.current.style.color = 'var(--color_input_text)' : anredeRef.current.style.color = 'var(--color_white)'
    };

    return (
        <div className="contact-form">
            {state == 2 ? (
                <div className="contact-form-subscribed">
                    <p className="white">
                        Subscribed
                    </p>
                </div>
            ) : (
                <form onSubmit={subscribe} className="contact-form-ui">
                    <select ref={anredeRef} style={{textTransform: 'capitalize'}} required onChange={anredeChange}>
                        <option value="" disabled selected>Anrede*</option>
                        <option value="Frau">Frau</option>
                        <option value="Herr">Herr</option>
                        <option value="Divers">Divers</option>
                        <option value="Keine">Keine</option>
                    </select> 
                    <input ref={vornameRef} style={{textTransform: 'capitalize'}} required placeholder="Vorname*" />
                    <input ref={nachnameRef} style={{textTransform: 'capitalize'}} required placeholder="Nachname*" />
                    <input ref={emailRef} required placeholder="Email*" type="email" />
                    <div className="checkbox">
                        <div className="checkbox-title white">
                            Einverständniserklärung der Nutzung Ihrer Daten
                        </div>
                        <div className="checkbox-content" onClick={() => setCheckbox(!checkbox)}>
                            <div className="checkbox-content-img">
                                {checkbox
                                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="var(--color_input_back)" width="10" height="10" viewBox="0 0 10 10"><path d="M12.2,2.024v9.982l-10,.018v-10Z" transform="translate(-2.197 -2.023)" fill="#4a4a4a"/></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="var(--color_input_back)" width="10" height="10" viewBox="0 0 10 10"><path d="M12.2,2.024v9.982l-10,.018v-10Zm-.706.739L2.975,2.754v8.531l8.517.018Z" transform="translate(-2.197 -2.023)" fill="#4a4a4a"/></svg>   
                                
                                }
                            </div>    
                            <span>
                                Ich stimme zu, dass die Initiative Urheberrecht Österreich die Daten, die Sie bei der Anmeldung zu diesem Newsletter angeben, dazu verwenden wird, um mit Ihnen in Kontakt zu bleiben und um Ihnen Nachrichten über interessenpolitische Forderungen, Aktivitäten und Veranstaltungen der Initiative Urheberrecht Österreich zu senden. Wir werten Ihre Nutzung des Newsletters aus, um unsere Zusendungen besser an Ihre Interessen und Bedürfnisse anpassen zu können. Dazu speichern wir Ihre Reaktionen (z.B. das Öffnen des Newsletters, Ihre Klicks auf Bild- und Textlinks) und das verwendete E-Mail-Programm.  Sie können den Newsletter jederzeit abbestellen, indem Sie auf den Abbestellungs-Link im Newsletter klicken. Alternativ können Sie uns unter info@initiativeurheberrecht.at kontaktieren. Weitere Informationen zu unseren Datenschutzpraktiken finden Sie auf unserer Website. Sie erklären sich durch Ihre Zustimmung damit einverstanden, dass wir Ihre Daten in Übereinstimmung mit diesen Bedingungen verarbeiten dürfen.
                            </span>
                        </div>

                    </div>
                    <button type="submit">Absenden</button>
                    {state === 3 && (
                        <p className="error-message">{errorMsg.toString() || "There was an error with your subscription. Please try again."}</p>
                    )}
                </form>
            )}
        </div>
    )
}