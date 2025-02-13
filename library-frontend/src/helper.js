export const updateCache = (cache, query, addedBook) => {
    const uniqByName = (a) => {
      let seen = new Set()
      return a.filter((item) => {
        let k = item.title
        return seen.has(k) ? false : seen.add(k)
      })
    }
  
    cache.updateQuery( query , (bookCache) => {
      if (!bookCache) {
        return null
      }
      else {
        return {
          allBooks: uniqByName(bookCache.allBooks.concat(addedBook)),
        }
      }
    })
}

