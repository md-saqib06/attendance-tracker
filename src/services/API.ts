export const addRecord = async (date: Date, classes: Array<String>) => {
    await fetch('http://localhost:3000/api/attendance', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "date": date,
            "classes": classes
        })
    })
}

export const getAllRecord = async () => {
    const res = await fetch('http://localhost:3000/api/attendance', {
        method: 'GET',
    })
    // console.log("getAllRecord():\n", res)
    return res
}

export const getMonthlyStats = async () => {
    const res = await fetch('http://localhost:3000/api/attendance/stats/monthly', {
        method: 'GET',
    })
    // console.log("getMonthlyStats():\n", res)
    return res
}

export const updateRecord = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/attendance/stats/monthly/${id}`, {
        method: 'PUT',
    })
    console.log("Monthly: \n", res)
}

export const deleteRecord = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/attendance/${id}`, {
        method: 'DELETE',
    })
    console.log(res)
}