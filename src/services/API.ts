export const addRecord = async (emailAddress: any, date: Date, classes: Array<String>) => {
    await fetch('http://localhost:3000/api/attendance', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "emailAddress": emailAddress,
            "date": date,
            "classes": classes
        })
    })
}

export const getAllRecord = async (emailAddresses: any) => {
    const res = await fetch(`http://localhost:3000/api/attendance/${emailAddresses}`, {
        method: 'GET',
    })
    return res
}

export const getMonthlyStats = async (emailAddresses: any) => {
    const res = await fetch(`http://localhost:3000/api/attendance/stats/monthly/${emailAddresses}`, {
        method: 'GET',
    })
    return res
}

export const updateRecord = async (id: String, classes: Array<String>) => {
    await fetch(`http://localhost:3000/api/attendance/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "classes": classes
        })
    })
}

export const deleteRecord = async (id: string) => {
    await fetch(`http://localhost:3000/api/attendance/${id}`, {
        method: 'DELETE',
    })
}