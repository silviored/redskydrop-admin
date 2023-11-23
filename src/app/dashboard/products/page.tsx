"use client"
import InfiniteScroll from 'react-infinite-scroll-component'
import './styles.css'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Loading } from '@/components/loading'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { ApiService } from '@/services'
import { currencyMask } from '@/utils/mask'
import { useRouter, useSearchParams } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/input'
import { stringToBase64 } from '@/utils/base64'


const TAKE_PRODUCTS = 20

export default function ProductsList() {
  const navigation = useRouter()
  const query = useSearchParams()
  const start_date = query.get('start_date')
  const end_date = query.get('end_date')
  const [products, setProducts] = useState<ProductResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const filterReactHookForm = useForm<FilterProps>()
  const handleLoadProducts = useCallback(async () => {
    try {
      const responseProducts = await ApiService.Product.getAll({
        skip: TAKE_PRODUCTS * (page - 1),
        take: TAKE_PRODUCTS,
        start_date,
        end_date,
      })
      setHasMore(!!responseProducts.items.length)
      if(!responseProducts?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)
      setProducts(oldProducts => ([...oldProducts, ...responseProducts.items]))
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [end_date, page, start_date])

  
  useEffect(() => {
    if(start_date || end_date){
      handleLoadProducts()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end_date, start_date])


  useEffect(() => {
    async function loadData() {
      await handleLoadProducts()
      setIsLoading(false)      
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  const handleSubmit = useCallback(async (data: FilterProps) => {
    let url = ''
    if(data.start_date) {
      url = `start_date=${data.start_date}`
    }
    if(data.end_date) {
      url += `&end_date=${data.end_date}`
    }
    if(data.status) {
      url += `&status=${data.status}`
    }
    if(url){
      navigation.replace(`${ROUTES.PRODUCTS.LIST}?${url}`)
    }
  }, [navigation])
  if(isLoading) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl products-container'>
      <div className='products-wrapper-filter'>
        <h3 className='px-3 pt-2 page-title'>Produtos</h3>
        <div className='products-container-button-tools'>
          <button onClick={() => {
            navigation.push(ROUTES.PRODUCTS.CREATE)

          }} className='btn-container btn-add w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
      </div>
      <div className='product-container-filter-container'>
          <form className='' onSubmit={filterReactHookForm.handleSubmit(handleSubmit)}>
            <div className='product-filter-form-container'>
              <Input
                placeholder='Data de inicio'
                {...filterReactHookForm.register('start_date')}
                type='date'
              />
              <Input
                placeholder='Data de fim'
                {...filterReactHookForm.register('end_date')}
                type='date'
              />
            </div>
          <div className='product-container-button-filter'>
            <button type='reset' onClick={() =>{
               navigation.replace(ROUTES.PRODUCTS.LIST)
               handleLoadProducts()
            }} className=' cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Limpar
            </button>
            <button type='submit' className=' cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Filtrar
            </button>
          </div>
          </form>
          <div>
          </div>
        </div>
      

        
            <InfiniteScroll
            dataLength={products.length}
            next={handleLoadProducts}
            hasMore={hasMore}
            loader={<Loading />}
            className='products-container-list'
          >
          <></>
          <Table>
        <Thead>
          <Tr>
            <Th>Cod.</Th>
            <Th>Nome</Th>
            <Th>Preço de venda</Th>
            <Th>Estoque</Th>
            <Th>Qtd vendas</Th>
            <Th>Total vendido</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {products.length ? products?.map(product => (
              <Tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>{product.nome}</Td>
                <Td>R$ {currencyMask(Number(product.preco))}</Td>
                <Td>{product.estoque}</Td>
                <Td>{product.qtd_vendas}</Td>
                <Td>R$ {currencyMask(Number(product.preco) * Number(product.qtd_vendas))}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.PRODUCTS.EDIT(product.id))
                  }} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Editar
                  </button>
                  <button onClick={() => {
                    navigation.push(`${ROUTES.PRODUCTS.CREATE}?product_id=${product.id}`)
                  }} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Duplicar
                  </button>
                </Td>
              </Tr>
            )): (
              <Tr >
                  <Td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum resultado encontrado</Td>
                  </Tr>
            )}
          </Tbody>
          </Table>
        </InfiniteScroll> 

    </div>
  )
}