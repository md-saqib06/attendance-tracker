const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const addRecord = async (emailAddress: any, date: Date, classes: Array<String>, totalClasses: Number, canceledClasses: Array<String>) => {
    await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "emailAddress": emailAddress,
            "date": date,
            "classes": classes,
            "totalClasses": totalClasses,
            "canceledClasses": canceledClasses
        })
    })
}

export const updateRecord = async (id: String, classes: Array<String>, totalClasses: Number, canceledClasses: Array<String>) => {
    await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "classes": classes,
            "totalClasses": totalClasses,
            "canceledClasses": canceledClasses
        })
    })
}

export const getAllRecord = async (emailAddresses: any) => {
    const res = await fetch(`${API_BASE_URL}/${emailAddresses}`, {
        method: 'GET',
    })
    return res
}

export const getOverviewStats = async (emailAddresses: any) => {
    const res = await fetch(`${API_BASE_URL}/stats/overview/${emailAddresses}`, {
        method: 'GET',
    })
    return res
}

export const getMonthlyStats = async (emailAddresses: any) => {
    const res = await fetch(`${API_BASE_URL}/stats/monthly/${emailAddresses}`, {
        method: 'GET',
    })
    return res
}

export const deleteRecord = async (id: string) => {
    await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    })
}