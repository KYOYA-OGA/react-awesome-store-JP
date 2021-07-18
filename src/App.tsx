import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes/Routes'
import Layout from './Layout'
import ModalContextProvider from './state/modal-context'
import AuthContextProvider from './state/auth-context'
import ProductsContextProvider from './state/products-context'
import CartContextProvider from './state/cart-context'
import SearchContextProvider from './state/search-context'
import './App.css'
import './fontawesome'

function App() {
  return (
    <AuthContextProvider>
      <SearchContextProvider>
        <ModalContextProvider>
          <ProductsContextProvider>
            <CartContextProvider>
              <BrowserRouter>
                <Layout>
                  <Routes />
                </Layout>
              </BrowserRouter>
            </CartContextProvider>
          </ProductsContextProvider>
        </ModalContextProvider>
      </SearchContextProvider>
    </AuthContextProvider>
  )
}

export default App
