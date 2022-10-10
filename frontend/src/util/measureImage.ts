export const measureImage = (file: File): Promise<{ width: number; height: number }> => {
    const _URL = window.URL || window.webkitURL
    return new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = _URL.createObjectURL(file)
        img.onload = function () {
            resolve({ width: img.width, height: img.height })
            _URL.revokeObjectURL(objectUrl)
        }
        img.onerror = err => reject(err)
        img.src = objectUrl
    })
}
