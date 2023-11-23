"use client"
import './styles.css'
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/keys';
import { ApiService } from '@/services';
import { Loading } from '@/components/loading';
import { Text } from '@/components/text';
import { currencyMask, phoneMask } from '@/utils/mask';
import moment, { ISO_8601 } from 'moment';
import { MASKS } from '@/constants/mask';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Modal } from '@/components/modal';
import { useForm } from 'react-hook-form';
import { Select } from '@/components/select';
import z from 'zod';
import { REQUIRED_MESSAGE } from '@/constants/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { ORDER_SITUATIONS } from '@/constants/types';
import { CacheService } from '@/services/cache';
import Image from 'next/image';

const changeStatusSchema = z
  .object({
    status: z.string(),
  })


type ChangeStatus = {
  status: string;
}

export default function BrandView({ params }: { params: { id: string}}) {
  const reactHookForm = useForm<ChangeStatus>({
    resolver: zodResolver(changeStatusSchema)
  })
  const navigation = useRouter()
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false)
  const [isFetch, setIsFetch] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<SaleProductResponseApi | null>()
  const [openModalImage, setOpenModalImage] = useState(false)
  const { data: order, isLoading } = useQuery<OrderResponseApi>(
    QUERY_KEYS.ORDERS.GET(params.id),
    async () => ApiService.Order.get({ id: params.id })
  );
  const { data: status, isLoading: isLoadingStatus } = useQuery<{ items: StatusResponseApi[] }>(
    QUERY_KEYS.STATUS.LIST,
    async () => ApiService.Status.getAll()
  );

  const handleDownload = useCallback(async () => {
    try {
      const response = await axios.get(order?.label_image || '', {
        responseType: 'arraybuffer',
      })
      const fileExtension = order?.label_image?.slice(order?.label_image?.lastIndexOf('.'), order?.label_image?.length)
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = `etiqueta-${order?.id}-${moment().format(MASKS.DATE.EUA_WITHOUT_TIME)}${fileExtension}`
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.log(error)
    }
  }, [order?.id, order?.label_image])

  const handleOpenModalChangeStatus = useCallback((open: boolean) => {
    setOpenModalChangeStatus(open)
  }, [])

  const handleOnSubmit = useCallback(async (data: ChangeStatus) => {
    setIsFetch(true)
    try {
      await ApiService.Order.updateStatus(data, params.id)
      CacheService.queryClient.invalidateQueries(QUERY_KEYS.ORDERS.GET(params.id))
      toast.success('Status alterado com sucesso')
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro ao alterar o status')
    }
    setIsFetch(false)
    setOpenModalChangeStatus(false)
  },[params?.id])

  if(isLoading || isLoadingStatus || isFetch) {
    return <Loading />
  }

  return (
    <>
        <div className='bg-white rounded-2xl shadow-2xl container-details-order'>
      <div className='container-header mb-4'>
        <div className='container-button'>
        <button onClick={() => handleOpenModalChangeStatus(true)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          <span>Alterar status</span>
        </button>
        <button disabled={!order?.ispago} onClick={handleDownload} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          <i className='fa fa-download'></i>
          <span>Etiqueta</span>
        </button>
        <button onClick={() => { navigation.push(ROUTES.ORDERS.LIST)}} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Listar
        </button>
        </div>
      </div>
      <div className='order-container-grid'>
        <div className="row">
          <Text label='Cod.' value={order?.id} />
          <Text label='Cliente' value={order?.user?.nome || ''} />
          <Text label='Celular' value={phoneMask(order?.user?.telefone || '')} />
        </div>
        <div className="row">
          <Text label='Preço total' value={`R$ ${currencyMask(Number(order?.preco_total))}`} />
          <Text label='Qtd. Produto' value={order?.vendaProdutos?.length} />
          <Text label='Status' value={ORDER_SITUATIONS[order?.status || ''] || order?.status} />
          <Text label='Reservado' value={order?.isreservado ? 'Sim' : 'Não'} />
          <Text label='Pago' value={order?.ispago ? 'Sim' : 'Não'} />
          <Text label='Pago em' value={order?.pagamentos?.[0]?.data_pagamento ? moment(order.pagamentos?.[0]?.data_pagamento).format(MASKS.DATE.LOCALE_WITHOUT_TIME): 'Pagamento Pendente'} />
          <Text label='Criado em' value={order?.criado_em ? moment(order.criado_em, ISO_8601).format(MASKS.DATE.LOCALE_WITHOUT_TIME) : ''} />
        </div>
        <div className="order-container-table-products">
          <Table>
        <Thead>
          <Tr>
            <Th>SKU</Th>
            <Th>Foto</Th>
            <Th>Produto</Th>
            <Th>Variação</Th>
            <Th>Quantidade</Th>
            <Th>Preço UN</Th>
            <Th>Preço total</Th>
          </Tr>
        </Thead>
            <Tbody>
              {order?.vendaProdutos?.length ? order?.vendaProdutos?.map(sale => (
              <Tr key={sale.id}>
                <Td>{sale.produto.sku}</Td>
                <Td onClick={() => {
                  if(!sale?.produto?.fotos?.[0]) return
                  setCurrentProduct(sale)
                  setOpenModalImage(true)
                }}>
                  {!!sale?.produto?.fotos?.[0] ? <Image src={sale?.produto?.fotos?.[0]} alt={sale?.produto?.nome} width={100} height={100} /> : <p>Sem Imagem</p>}
                </Td>
                <Td>{sale.produto.nome}</Td>
                <Td>{sale.variacao?.name}</Td>
                <Td>{sale.qtd}</Td>
                <Td>R$ {currencyMask(Number(sale.preco_unit))}</Td>
                <Td>R$ {currencyMask(order.preco_total)}</Td>
              </Tr>
            )): (
              <Tr >
                  <Td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum resultado encontrado</Td>
                  </Tr>
            )}
          </Tbody>
          </Table>
        </div>
      </div>
    </div>
    <Modal
      onClose={() => setOpenModalImage(false)}
      visible={openModalImage}
    >
      <h3>{currentProduct?.produto?.nome} - {currentProduct?.produto?.sku}</h3>
      <Image src={currentProduct?.produto?.fotos?.[0] || ''} alt={currentProduct?.produto?.nome || ''} width={800} height={800} />
    </Modal>
        <Modal
      onClose={() => handleOpenModalChangeStatus(false)}
      visible={openModalChangeStatus}
    >
      <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit(handleOnSubmit)}
  >
    <div className='mb-4' style={{ width: '300px' }}>
      <Select
        placeholder='Status'
        errors={reactHookForm.formState.errors.status?.message}
        {...reactHookForm.register('status')}
        options={status?.items?.map(option => ({
          label: option.nome,
          value: option.nome,
        })) || []}
        />
    </div>
    <div className='mb-5 text-center color-container-footer'>
      <button
        type='submit'
        className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
      >
        Salvar
      </button>
    </div>
  </form>
    </Modal>
    </>

  )
}