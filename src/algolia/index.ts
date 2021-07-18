import algoliasearch from 'algoliasearch'

const algoliaClient = algoliasearch(
  'JO4WGEF1KS',
  '1f3bafaeefc06507cd11af4ee777c876'
)

// create the indices on Algolia
export const usersIndex = algoliaClient.initIndex('users')
export const productsIndex = algoliaClient.initIndex('products')
export const ordersIndex = algoliaClient.initIndex('orders')
