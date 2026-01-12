export default function NewlineText ({ text }) {
    const newText = text.split('\n').map((str, index, array) => 
        index === array.length - 1 ? str : <>
            {str}
            <br />
        </>
    );
    return <>{newText}</>;
}