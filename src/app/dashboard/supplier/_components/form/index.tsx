import { Input } from '@/components/input'
import './styles.css'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchema } from './form-validation';
import { useMutation } from '@tanstack/react-query';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { ROUTES } from '@/constants/routes';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation'
import { Select } from '@/components/select';
import { useEffect, useState } from 'react';

type FormProps = {
  isEditMode?: boolean
  onSave?: (supplier: SupplierRequestApi) => Promise<void>
  supplier?: SupplierResponseApi
}

export function Form({ onSave, supplier, isEditMode }: FormProps) {
  const navigation = useRouter()
  const [formUpdated, setFormUpdated] = useState<boolean>(false)
  const reactHookForm = useForm<SupplierRequestApi>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      ativado: '1'
    }
  });

  
  const addNewSupplier = useMutation({
    mutationFn: async (supplier: SupplierRequestApi) => {
      await ApiService.Supplier.create(supplier)
    },
    onSuccess: (_data, supplier: SupplierRequestApi) => {
      toast.success(`o fornecedor ${supplier.nome} foi adicionada com sucesso!`,)

      navigation.push(ROUTES.SUPPLIERS.LIST)
    },
    onError: (error: ApiError, supplier: SupplierRequestApi) => {
      toast.error(error.message || `Erro ao adicionar ${supplier.nome}!`)
    },
  })

  

  useEffect(() => {
    if(supplier && isEditMode && !formUpdated) {
      reactHookForm.reset({
        nome: supplier.nome,
        telefone: supplier.telefone,
        ativado: supplier.ativado ? '1' : '0',
      })
      setFormUpdated(true)
    }
  }, [formUpdated, isEditMode, reactHookForm, supplier])
  
  return (
    <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit((supplier => {
      if(isEditMode) {
        onSave?.(supplier)
        return
      }
      addNewSupplier.mutate(supplier)
    }))}
  >
    <div className='supplier-grid-first-row mb-4'>
      <Input
        placeholder='Nome'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('nome')}
      />
           <Controller 
           name='telefone'
           control={reactHookForm.control}
           render={({ field }) => {
            return (
              <Input
              placeholder='Telefone'
              mask='(99) 9999-9999'
              errors={reactHookForm.formState.errors.telefone?.message}
              {...field}
            />
            )
           }}
            />
      <Select
        placeholder='Ativo'
        disabled={!isEditMode}
        errors={reactHookForm.formState.errors.ativado?.message}
        {...reactHookForm.register('ativado')}
        options={[
          {
            label: 'Sim',
            value: 1
          },
          {
            label: 'Não',
            value: 0
          },
        ]}
        />
    </div>
    <div className='mb-5 text-center supplier-container-footer'>
      <button
        type='submit'
        className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
      >
        Salvar
      </button>
    </div>
  </form>
  )
}