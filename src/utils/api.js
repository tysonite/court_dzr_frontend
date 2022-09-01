/* Api methods to call /functions */

const readAll = (email) => {
  return fetch(`/.netlify/functions/cases-read-all/${email}`).then((response) => {
    return response.json()
  });
}

export default {
  readAll: readAll
}
