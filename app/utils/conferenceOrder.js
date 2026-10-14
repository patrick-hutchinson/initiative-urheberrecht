export const getConferenceSortValue = (item) => {
    // Sort by the displayed conference month/year, e.g. 4'26 or 11’25.
    const labels = [item.menuTitle, item.pageTitle, item.slug?.current]
    for (const label of labels) {
        const match = `${label || ''}`.match(/\b(0?[1-9]|1[0-2])\s*['’‘′ʼ]\s*(\d{4}|\d{2})\b/)
        if (match) {
            const year = Number(match[2]) + (match[2].length === 2 ? 2000 : 0)
            return year * 100 + Number(match[1])
        }
    }

    const date = item.firstProgramDate ? new Date(item.firstProgramDate) : null
    if (date && !Number.isNaN(date.getTime())) {
        return date.getUTCFullYear() * 100 + date.getUTCMonth() + 1
    }

    const yearMatch = labels.filter(Boolean).join(' ').match(/(?:['’‘′ʼ]\s*|\b)(\d{2})\b/)
    return yearMatch ? (2000 + Number(yearMatch[1])) * 100 : 0
}

export const newestConferenceFirst = (a, b) =>
    getConferenceSortValue(b) - getConferenceSortValue(a);
