/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query


exports.handler = (event, context) => {
  console.log('Function `cases-read-all` invoked')
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
    domain: 'db.eu.fauna.com'
  }) 
  return client.query(q.Paginate(q.Match(q.Index('All_Cases'))))
    .then((response) => {
      const casesRefs = response.data
      console.log('Cases refs', casesRefs)
      console.log(`${casesRefs.length} cases found`)

      const getAllCasesDataQuery = casesRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllCasesDataQuery).then((ret) => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        }
      })
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
