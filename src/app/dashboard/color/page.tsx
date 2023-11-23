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
import moment, { ISO_8601 } from 'moment'
import { MASKS } from '@/constants/mask'


const TAKE_COLORS = 20

export default function ColorsList() {
  const query = useSearchParams()
  const status = query.get('status')
  const navigation = useRouter()
  const [colors, setColors] = useState<ColorResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const handleLoadColors = useCallback(async () => {
    try {
      const responseColors = await ApiService.Color.getAll({
        skip: TAKE_COLORS * (page - 1),
        take: TAKE_COLORS,
      })
      setHasMore(!!responseColors.items.length)
      if(!responseColors?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)
      setColors(oldColors => ([...oldColors, ...responseColors.items]))
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [page])


  useEffect(() => {
    async function loadData() {
      await handleLoadColors()
      setIsLoading(false)      
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[status])


  if(isLoading) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl colors-container'>
<div className='colors-container-tools'>
        <h3 className='px-3 pt-2 page-title'>Cores</h3>
        <div className='color-container-button-tools'>
          <button onClick={() => {
            navigation.push(ROUTES.COLORS.CREATE)
          }} className='btn-container btn-add w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
      </div>
            <InfiniteScroll
            dataLength={colors.length}
            next={handleLoadColors}
            hasMore={hasMore}
            loader={<Loading />}
            className='colors-container-list'
          >
          <></>
          <Table>
        <Thead>
          <Tr>
            <Th>Cod.</Th>
            <Th>Nome</Th>
            <Th>Cod. HEX</Th>
            <Th>Produto</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {colors.length ? colors?.map(color => (
              <Tr key={color.id}>
                <Td>{color.id}</Td>
                <Td>{color.nome}</Td>
                <Td>{color.hex_code}</Td>
                <Td>{color.product?.nome}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.COLORS.EDIT(color.id))
                  }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Editar
                  </button>
                  {/* <button onClick={() => {
                    navigation.push(ROUTES.COLORS.VIEW(color.id))
                  }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Visualizar
                  </button> */}
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