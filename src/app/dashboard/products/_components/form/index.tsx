/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Input } from '@/components/input'
import './styles.css'
import { Controller, FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchema } from './form-validation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { ROUTES } from '@/constants/routes';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { QUERY_KEYS } from '@/constants/keys';
import { Loading } from '@/components/loading';
import { SELECT_BRAZILIAN_STATES } from '@/constants/brazilian-states';
import { currencyMask } from '@/utils/mask';
import { Modal } from '@/components/modal';
import { base64ToString, stringToBase64 } from '@/utils/base64';
import { CONDITIONS_PRODUCT_OPTIONS, DEFAULT_YES_NOT_OPTIONS, SITUATIONS_PRODUCT_OPTIONS, UNIT_MEASUREMENT_PRODUCT_OPTIONS } from '@/constants/types';

type FormProps = {
  isEditMode?: boolean
  type?: 'create' | 'update'
  onSave?: (product: ProductRequestApi) => Promise<void>
  product?: ProductResponseApi
}

export function Form({ onSave, product, isEditMode, type }: FormProps) {
  const queryClient = useQueryClient()
  const query = useSearchParams()
  const openModal = query.get('modal')
  const imageURL = query.get('image')
  const imageIndex = query.get('position')
  const [loading, setLoading] = useState(false)
  const [formUpdated, setFormUpdated] = useState<boolean>(false)
  const navigation = useRouter()
  const reactHookForm = useForm<ProductRequestApi>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      fotos: [{ id: 1 }]
    }
  });


  const { data: categories, isLoading: isLoadingCategories } = useQuery<{ items: CategoryResponseApi[] }>(
    QUERY_KEYS.CATEGORIES.LIST,
    async () => ApiService.Category.getAll()
  );

  const categoryID = reactHookForm.watch('categoriaid')

  const { data: subCategories = [] } = useQuery<CategoryResponseApi[]>(
    QUERY_KEYS.CATEGORIES.GET(categoryID?.toString()),
    async () => {
      if(!categoryID) return []
      const responseCategories = await ApiService.Category.get({ id: categoryID.toString() })
      return responseCategories.childCategories
    },
    {
      enabled: !!categoryID
    }
  );

  const addNewProduct = useMutation({
    mutationFn: async (product: ProductRequestApi) => {
      const formData = new FormData()
      if(product?.video?.[0]) {
        formData.append('video', product?.video?.[0])
      }
      product?.fotos?.forEach((photo: string[]) => {
        if(photo?.[0]){
          formData.append('fotos', photo[0])
        }
      })
      formData.append('produtosVariacoes', JSON.stringify(product.produtosVariacoes))
      delete product.produtosVariacoes
      delete product.fotos
      delete product.video
      Object.entries(product).forEach(([key, value]) => {
        if(!value || value === 'undefined' || value === 'null') return
        formData.append(key, value)
      })
      await ApiService.Product.create(formData)
    },
    onSuccess: (_data, product: ProductRequestApi) => {
      setLoading(false)
      toast.success(`O produto ${product.nome} foi adicionado com sucesso!`,)
      navigation.push(ROUTES.PRODUCTS.LIST)
    },
    onError: (error: ApiError, product: ProductRequestApi) => {
      toast.error(error.message || `Erro ao adicionar ${product.nome}!`)
      setLoading(false)
    },
  })


  const oldPhotos = useFieldArray({
    name: 'oldPhotos',
    control: reactHookForm.control,
    keyName: 'customID',
  })

  const variantsFields = useFieldArray({
    name: 'produtosVariacoes',
    control: reactHookForm.control,
    keyName: 'customID',
  })

  const photos = useFieldArray({
    name: 'fotos',
    control: reactHookForm.control,
    keyName: 'customID',
  })

  useEffect(() => {
    if(product && isEditMode && !formUpdated) {
      const { fotos, video, produtosVariacoes ,...restProduct } = product
      reactHookForm.reset({
        ...restProduct,
        estoque: restProduct.estoque?.toString(),
        estoquemin: restProduct.estoquemin?.toString(),
        tempogarantia: restProduct.tempogarantia?.toString(),
        unidade_caixa: restProduct.unidade_caixa?.toString(),
        mais_vendido: restProduct.mais_vendido?.toString(),
        volume: restProduct.volume?.toString(),
        peso_bruto: currencyMask(restProduct.peso_bruto),
        peso: currencyMask(restProduct.peso),
        preco: currencyMask(product.preco),
        preco_compra: currencyMask(product.preco_compra),
        preco_custo: currencyMask(product.preco_custo),
      })
      reactHookForm.setValue('categoriaid', restProduct.categoriaid?.toString())
      reactHookForm.setValue('subcategoriaid', restProduct.subcategoriaid?.toString())
      reactHookForm.setValue('marcaid', restProduct.marcaid?.toString())
      reactHookForm.setValue('fornecedorid', restProduct.fornecedorid?.toString())
     
      fotos?.forEach(photo => {
        oldPhotos.append({ url: photo })
      })
      produtosVariacoes?.forEach(variants => {
        variantsFields.append({ id: variants.id, stock: variants.stock.toString(), name: variants.name, sku: variants.sku })
      })
      setFormUpdated(true)
    }
  }, [formUpdated, isEditMode, oldPhotos, product, reactHookForm, variantsFields])
console.log(reactHookForm.formState.errors)


const handleCLoseModal = useCallback(() => {
  navigation.replace(ROUTES.PRODUCTS.EDIT(product?.id?.toString() as string))
}, [navigation, product?.id])

const handleOpenModal = useCallback(({ url, index }: { url: any; index?: number }) => {
  navigation.replace(`?modal=true&image=${stringToBase64(url)}${index !== -1 ? `&position=${index}` : ''}`)
}, [navigation])

const handleRemoveImage = useCallback(async () => {
  if(!imageURL) return
  if(!product?.id) return
  try {
    await ApiService.Product.removeUpload({ url: imageURL as string, id: product?.id })
    toast.success('Mídia removida com sucesso', {
      toastId: 'toast-removed'
    })
    if(imageIndex) {
      oldPhotos.remove(Number(imageIndex))
    }
    if(!imageIndex) {
      queryClient.setQueryData<ProductRequestApi>(
        QUERY_KEYS.PRODUCTS.UPDATE(product?.id),
        () => {
          product.video = undefined
          return product
        },
      )
    }
  } catch (error: unknown) {
    toast.error((error as ApiError).message || 'Ocorreu um erro ao excluir sua imagem')
  }
  handleCLoseModal()
}, [handleCLoseModal, imageIndex, imageURL, oldPhotos, product, queryClient])


  if(loading || isLoadingCategories) {
    return <Loading />
  }
  
  return (
   <>
     <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit((product => {
      setLoading(true)
      if(isEditMode && type !== 'create') {
        onSave?.(product)
        setLoading(false)
        return
      }
      addNewProduct.mutate(product)
    }))}
  >
    <div className='product-container-grid-first-row mb-4'>
      <Input
        placeholder='Nome'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('nome')}
        
      />
            <Controller
      control={reactHookForm.control}
      name='preco_compra'
        render={({ field }) => {
          return (
            <Input
        placeholder='Preço de compra'
        errors={reactHookForm.formState.errors.preco_compra?.message ? 'Campo obrigatório': undefined}
        {...field}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if(event.target.value) {
            event.target.value = currencyMask(event.target.value)
          }
          field.onChange(event)
        }}
      />
          )
        }}
      />

      <Controller
      control={reactHookForm.control}
      name='preco_custo'
      render={({ field }) => {
        return (
          <Input
            placeholder='Preço de custo'
            errors={reactHookForm.formState.errors.preco_custo?.message ? 'Campo obrigatório': undefined}
            {...field}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if(event.target.value) {
                event.target.value = currencyMask(event.target.value)
              }
              field.onChange(event)
            }}
          />
        )
      }}
      />

      <Controller
      control={reactHookForm.control}
      name='preco'
        render={({ field }) => {
          return (
            <Input
        placeholder='Preço de venda'
        errors={reactHookForm.formState.errors.preco?.message ? 'Campo obrigatório': undefined}
        {...field}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if(event.target.value) {
            event.target.value = currencyMask(event.target.value)
          }
          field.onChange(event)
        }}
      />
          )
        }}
      />
      


    </div>

    <div className='product-container-grid-second-row mb-4'>
      
    <Select
        placeholder='Categoria'
        errors={reactHookForm.formState.errors.categoriaid?.message}
        {...reactHookForm.register('categoriaid')}
        options={categories?.items?.map(category => ({ label: category.nome, value: category.id })) || []}
        />
       <Select
        placeholder='Sub categoria'
        
        errors={reactHookForm.formState.errors.subcategoriaid?.message}
        {...reactHookForm.register('subcategoriaid')}
        options={subCategories?.map(subCategory => ({ label: subCategory.nome, value: subCategory.id }))}
        />
    {/* <Select
        placeholder='Marca'
        
        errors={reactHookForm.formState.errors.marcaid?.message}
        {...reactHookForm.register('marcaid')}
        options={brands?.items?.map(product => ({ label: product.nome,value: product.id })) || []}
        /> */}

        {/* <Select
        placeholder='Estado'
        
        errors={reactHookForm.formState.errors.estado?.message}
        {...reactHookForm.register('estado')}
        options={SELECT_BRAZILIAN_STATES}
        /> */}
        <Input
        placeholder='Estoque'
        errors={reactHookForm.formState.errors.estoque?.message}
        {...reactHookForm.register('estoque')}
        type='number'
        
      />

      <Input
        placeholder='Estoque mínimo'
        errors={reactHookForm.formState.errors.estoquemin?.message}
        {...reactHookForm.register('estoquemin')}
        type='number'
        
      />
      <Input
        placeholder='SKU'
        errors={reactHookForm.formState.errors.sku?.message}
        {...reactHookForm.register('sku')}
        
      />

    </div>

    <div className='product-container-grid-four-row mb-4'>
    <Input
        placeholder='Garantia (meses)'
        errors={reactHookForm.formState.errors.tempogarantia?.message}
        {...reactHookForm.register('tempogarantia')}
        type='number'
        
      />
      <Input
        placeholder='Largura (cm)'
        errors={reactHookForm.formState.errors.largura?.message}
        {...reactHookForm.register('largura')}
        
      />
      <Input
        placeholder='Altura (cm)'
        errors={reactHookForm.formState.errors.altura?.message}
        {...reactHookForm.register('altura')}
        
      />
      <Input
        placeholder='Comprimento (cm)'
        errors={reactHookForm.formState.errors.comprimento?.message}
        {...reactHookForm.register('comprimento')}
        
      />
      <Input
        placeholder='Profundidade (cm)'
        errors={reactHookForm.formState.errors.profundidade?.message}
        {...reactHookForm.register('profundidade')}
        
      />
      <Input
        placeholder='Data de validade'
        errors={reactHookForm.formState.errors.data_validade?.message}
        {...reactHookForm.register('data_validade')}
        type='date'
      />
      <Input
        placeholder='Unidade por caixa'
        errors={reactHookForm.formState.errors.unidade_caixa?.message}
        {...reactHookForm.register('unidade_caixa')}
        
      />

      <Input
        placeholder='Tipo do item'
        errors={reactHookForm.formState.errors.tipo_item?.message}
        {...reactHookForm.register('tipo_item')}
        
      />
      {/* <Input
        placeholder='Tributos'
        errors={reactHookForm.formState.errors.tributos?.message}
        {...reactHookForm.register('tributos')}
        
      /> */}

<Input
        placeholder='NCM'
        errors={reactHookForm.formState.errors.ncm?.message}
        {...reactHookForm.register('ncm')}
        
      />

      <Input
        placeholder='CEST'
        errors={reactHookForm.formState.errors.cest?.message}
        {...reactHookForm.register('cest')}
        
      />
      <Input
        placeholder='Volume'
        errors={reactHookForm.formState.errors.volume?.message}
        {...reactHookForm.register('volume')}
        
      />
      
      <Controller
      control={reactHookForm.control}
      name='peso'
        render={({ field }) => {
          return (
            <Input
              placeholder='Peso líquido (Kg)'
              errors={reactHookForm.formState.errors.peso?.message}
              {...field}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if(event.target.value) {
                  event.target.value = currencyMask(event.target.value)
                }
                field.onChange(event)
              }}
            />
          )
        }}
      />
      
      <Controller
      control={reactHookForm.control}
      name='peso_bruto'
        render={({ field }) => {
          return (
            <Input
            placeholder='Peso bruto (Kg)'
            errors={reactHookForm.formState.errors.peso_bruto?.message}
              {...field}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if(event.target.value) {
                  event.target.value = currencyMask(event.target.value)
                }
                field.onChange(event)
              }}
            />
          )
        }}
      />

      <Input
        placeholder='GTIN/EAN'
        errors={reactHookForm.formState.errors.gtin_ean?.message}
        {...reactHookForm.register('gtin_ean')}
        type='number'        
      />
      <Input
        placeholder='GTIN/EAN da embalagem'
        errors={reactHookForm.formState.errors.gtin_ean_embalagem?.message}
        {...reactHookForm.register('gtin_ean_embalagem')}
        type='number'
        
      />
      <Input
        placeholder='Código de homologação'
        errors={reactHookForm.formState.errors.code_homologation?.message}
        {...reactHookForm.register('code_homologation')}
        
      />
{/* 
      <Select
        placeholder='Fornecedor'
        errors={reactHookForm.formState.errors.fornecedorid?.message}
        {...reactHookForm.register('fornecedorid')}
        options={suppliers?.items?.map(supplier => ({ label: supplier.nome, value: supplier.id })) || []}
        /> */}

      <Select
        placeholder='Situação'
        errors={reactHookForm.formState.errors.situacao?.message}
        {...reactHookForm.register('situacao')}
        options={SITUATIONS_PRODUCT_OPTIONS}
        />

      <Select
        placeholder='Estado de uso'
        errors={reactHookForm.formState.errors.condicao?.message}
        {...reactHookForm.register('condicao')}
        options={CONDITIONS_PRODUCT_OPTIONS}
        />

      <Select
        placeholder='Unidade de medida'
        errors={reactHookForm.formState.errors.unidade_medida?.message}
        {...reactHookForm.register('unidade_medida')}
        options={UNIT_MEASUREMENT_PRODUCT_OPTIONS}
        />

      <Select
        placeholder='Mais vendido'
        errors={reactHookForm.formState.errors.mais_vendido?.message}
        {...reactHookForm.register('mais_vendido')}
        options={DEFAULT_YES_NOT_OPTIONS}
        />
    </div>


    {/* <div className='mb-4'>
      <Textarea
        placeholder='Descrição Curta'
        style={{ minHeight: '100px' }}
        errors={reactHookForm.formState.errors.descricao_curta?.message}
        {...reactHookForm.register('descricao_curta')}
        
      />
    </div> */}

    <div className='mb-4'>
      <Textarea
        placeholder='Descricao'
        style={{ minHeight: '100px' }}
        errors={reactHookForm.formState.errors.descricao?.message}
        {...reactHookForm.register('descricao')}
        
      />
    </div>

    <div className='mb-4'>
      <Textarea
        placeholder='Observações'
        style={{ minHeight: '100px' }}
        errors={reactHookForm.formState.errors.observacao?.message}
        {...reactHookForm.register('observacao')}
        
      />
    </div>

    <div className='mb-4'>
      <Textarea
        placeholder='Informações Adicionais'
        style={{ minHeight: '100px' }}
        errors={reactHookForm.formState.errors.informacao_adicional?.message}
        {...reactHookForm.register('informacao_adicional')}
        
      />
    </div>

    <div className='mb-4'>
      <div className='product-container-header-upload'>
          <h2>Variações</h2>
          <button type='button' onClick={() => variantsFields.append({ id: 0, stock: '', name: '', sku: '' })} className='btn-container cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
        {variantsFields?.fields.map((color, index) => (
          <div className='mb-4' key={color.customID} style={{ display: 'grid', gridTemplateColumns: '60% 30% 1fr', justifyContent: 'center', alignItems: 'end', gap: '1rem' }}>
              <Input
                placeholder='Nome'
                errors={reactHookForm.formState.errors.produtosVariacoes?.[index]?.name?.message}
                {...reactHookForm.register(`produtosVariacoes.${index}.name`)}        
              />
              <Input
                placeholder='SKU'
                errors={reactHookForm.formState.errors.produtosVariacoes?.[index]?.sku?.message}
                {...reactHookForm.register(`produtosVariacoes.${index}.sku`)}        
              />
              <Input
                placeholder='Estoque'
                errors={reactHookForm.formState.errors.produtosVariacoes?.[index]?.stock?.message}
                {...reactHookForm.register(`produtosVariacoes.${index}.stock`)}        
              />
              <button style={{ height: '48px' }} type='button' onClick={() => variantsFields.remove(index)} className='btn-container btn-remove-photo cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Remover</button>
              {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              </div> */}
          </div>
        ))}
      </div>

    <div className='mb-4'>
      <div className='product-container-header-upload'>
        <h2>Mídias</h2>
        <button type='button' onClick={() => photos.append({})} className='btn-container cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
      </div>
      {photos?.fields.map((photo, index) => (
              <div className='mb-4' key={photo.customID}>
                <Input
              type='file'
              accept="image/*"
              placeholder='Imagem'
              {...reactHookForm.register(`fotos.${index}`)}
              
            />
              </div>
      ))}
      
    <div className='mb-4'>
      <Input
        placeholder='Video'
        errors={reactHookForm.formState.errors.video?.message}
        {...reactHookForm.register(`video`)}
        type='file'
        accept='video/*'        
      />
    </div>
    </div>

    {!!product?.video && (
      <div className='mb-4 '>
      <h3 className='mb-4'>Video</h3>
      <div className='product-container-video-list'>
        <video className='product-container-video' src={product?.video} controls></video>
        <button type='button' onClick={() => handleOpenModal({ url: product?.video })} className='btn-container btn-remove-photo cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Remover</button>
      </div>
    </div>
    )}

    {!!oldPhotos?.fields?.length && (
      <div className='mb-4 '>
      <h3>Imagens</h3>
      <div className='product-container-photos-list'>
        {oldPhotos?.fields.map((photo, index) => {
          const copyPhoto = photo as unknown as { url: string; customID: string}
          return (
            <div className='mb-4 product-photo-container rounded-2xl shadow-2xl'  key={copyPhoto.customID}>
            <img src={copyPhoto.url}  />
            <button type='button' onClick={() => handleOpenModal({ url: copyPhoto.url, index })} className='btn-container btn-remove-photo cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Remover</button>
          </div>
          )
        })}
      </div>
    </div>
    )}


    <div className='mb-5 text-center container-footer'>
      <button
        type='submit'
        className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
      >
        Salvar
      </button>
    </div>
  </form>
  <Modal 
    onClose={handleCLoseModal}
    visible={openModal === 'true'}
   >
    <div className='mt-4 product-container-modal-content'>
    <strong>Realmente deseja excluir essa imagem, ela sera perdida e não poderá ser recuperada</strong>
      <div className='product-container-button-modal-action'>
      <button
          type='button'
          onClick={handleCLoseModal}
          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
        >
          Não
        </button>
        <button
          type='button'
          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
          onClick={handleRemoveImage}
        >
          Sim
        </button>
      </div>
    </div>
   </Modal>
   </>
  )
}