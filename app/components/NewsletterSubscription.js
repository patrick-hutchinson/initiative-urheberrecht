import { useState, useEffect, useRef } from "react";
export default function NewsletterSubscription() {
    const [state, setState] = useState(0)
    const [errorMsg, setErrorMsg] = useState("")
    const inputRef = useRef()

    // 0 - initial , 1 - loading, 2 - success, 2 - error
    const subscribe = async (e) => {
        e.preventDefault()
        setState(1)
        setErrorMsg("")
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                body: e.target[0].value,
        })

        const data = await res.json();
        if (data.error !== null) {
            throw data.error;
        }
            setState(2);
        } catch (e) {
            setErrorMsg(e);
            setState(3);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if(inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts before the timeout finishes
    }, [])
  
    return (
        <div className="newsletter-subscription">
            {state == 2 ? (
                <div className="contact-form">
                    <h1 className="white">
                        Subscribed
                    </h1>
                </div>
            ) : (
                <form onSubmit={subscribe} className="contact-form">
                    <input ref={inputRef} required placeholder="Newsletter" type="email" id="Email" autoFocus/>
                    <button type="submit">anmelden</button>
                    {state === 3 ? (
                        <p className="text-red-500 mt-3">{errorMsg}</p>
                    ) : (
                            ""
                        )}
                </form>
            )}
        </div>
    )
}
