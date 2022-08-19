/* Api methods to call /functions */

const readAll = () => {
  return fetch('/.netlify/functions/cases-read-all').then((response) => {
    return response.json()
  })
}

export default {
  readAll: readAll
}
