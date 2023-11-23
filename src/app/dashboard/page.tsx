"use client"
import { currencyMask } from '@/utils/mask'
import './styles.css'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/keys'
import { ApiService } from '@/services'
import { ROUTES } from '@/constants/routes'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table'
import moment, { ISO_8601 } from 'moment'
import { MASKS } from '@/constants/mask'
import { Loading } from '@/components/loading'
import { useRouter } from 'next/navigation'




type CardProps = {
  title: string
  value: string
  backgroundColor: string
  color?: string
  iconClassName: string
  onClick: () => void
}

function Card({ backgroundColor, color,title,value,iconClassName,onClick }: CardProps) {
  return (
  <div className='bg-white rounded-2xl shadow-2xl dashboard-card-container' onClick={onClick}>
    <div className='dashboard-card-container-info'>
      <h6>{title}</h6>
      <p>{value}</p>
    </div>
    <div className='dashboard-card-container-icon' style={{ backgroundColor }}>
      <i className={iconClassName} style={{ color }}/>
    </div>
  </div>
  )
}

export default function Dashboard() {
  const navigation = useRouter()
  const { data, isLoading: isLoadingReport } = useQuery(
    QUERY_KEYS.REPORT.DASHBOARD,
    async () => ApiService.Sale.reportDashboard()
  );
  const { data: sales = [], isLoading: isLoadingSale } = useQuery<SaleResponseApi[]>(
    QUERY_KEYS.SALES.LIST_10,
    async () => {
      const sales = await ApiService.Sale.getAll({
        skip: 0,
        take: 10
      })
      return sales.items
    }
  );

  if(isLoadingReport || isLoadingSale) {
    return <Loading />
  }
  return (
    <div className='dashboard-wrapper'>
      <div className='dashboard-card-wrapper'>
      <Card 
        backgroundColor='#fbb140'
        iconClassName='fas fa-dollar-sign'
        title='Total pendente'
        value={`R$ ${currencyMask(Number(data?.pending) || 0)}`}
        onClick={() => {
          // navigation.push(`${ROUTES.SALE.ROOT}?status=awaiting_payment`)
        }}
      />
      <Card 
        backgroundColor='rgb(45 206 137)'
        iconClassName='fas fa-dollar-sign'
        title='Total pago'
        value={`R$ ${currencyMask(Number(data?.paid) || 0)}`}
        onClick={() => {
          // navigation.push(`${ROUTES.SALE.ROOT}?status=paid`)
        }}
      />
      <Card 
        backgroundColor='red'
        iconClassName='fas fa-dollar-sign'
        title='Total cancelado'
        value={`R$ ${currencyMask(Number(data?.cancelled) || 0)}`}
        onClick={() => {
          // navigation.push(`${ROUTES.SALE.ROOT}?status=cancelled`)
        }}
      />
      </div>
      <div className='bg-white rounded-2xl shadow-2xl sales-container'>
        <div className='dashboard-container-orders-header'>
          <h3 className='page-title'>Pedidos recentes</h3>
          <button onClick={() => {
            navigation.push(ROUTES.ORDERS.LIST)
          }} className='btn-view-all w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Ver Todos
            </button>
        </div>

          
        <Table>
          <Thead>
            <Tr>
              <Th>Cod.</Th>
              <Th>Preço total</Th>
              <Th>Qtd. Produtos</Th>
              <Th>Reservado</Th>
              <Th>Pago</Th>
              <Th>Pago em</Th>
              <Th>Criado em</Th>
            </Tr>
          </Thead>
              <Tbody>
                {sales.length ? sales?.map(sale => (
                <Tr key={sale.id}>
                  <Td>{sale.id}</Td>
                  <Td>R$ {currencyMask(Number(sale.preco_total))}</Td>
                  <Td>{sale.vendaProdutos?.length}</Td>
                  <Td>{sale.isreservado ? 'Sim' : 'Não'}</Td>
                  <Td data-paid={sale.ispago}>{sale.ispago ? 'Sim' : 'Não'}</Td>
                  <Td>{sale.pagamentos?.[0]?.data_pagamento ? moment(sale.pagamentos?.[0]?.data_pagamento).format(MASKS.DATE.LOCALE_WITHOUT_TIME): 'Pagamento Pendente'}</Td>
                  <Td>{sale.criado_em ? moment(sale.criado_em, ISO_8601).format(MASKS.DATE.LOCALE_WITHOUT_TIME) : ''}</Td>
                </Tr>
              )) : (
                <Tr >
                  <Td colSpan={8} style={{ textAlign: 'center' }}>Nenhum resultado encontrado</Td>
                  </Tr>
              )}
            </Tbody>
            </Table>

      </div>
    </div>
  )
}
