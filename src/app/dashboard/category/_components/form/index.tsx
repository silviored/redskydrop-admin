import { Input } from '@/components/input'
import './styles.css'
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchema } from './form-validation';
import { useMutation } from '@tanstack/react-query';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { ROUTES } from '@/constants/routes';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/textarea';

type FormProps = {
  isEditMode?: boolean
  onSave?: (category: CategoryRequestApi) => Promise<void>
  category?: CategoryResponseApi
}

export function Form({ onSave, category, isEditMode }: FormProps) {
  const [formUpdated, setFormUpdated] = useState<boolean>(false)
  const navigation = useRouter()
  const reactHookForm = useForm<CategoryRequestApi>({
    resolver: zodResolver(createSchema),
  });

  
  const addNewCategory = useMutation({
    mutationFn: async (category: CategoryRequestApi) => {
      await ApiService.Category.create(category)
    },
    onSuccess: (_data, category: CategoryRequestApi) => {
      toast.success(`A categoria ${category.nome} foi adicionada com sucesso!`,)

      navigation.push(ROUTES.CATEGORIES.LIST)
    },
    onError: (error: ApiError, category: CategoryRequestApi) => {
      toast.error(error.message || `Erro ao adicionar ${category.nome}!`)
    },
  })

  const subCategories = useFieldArray({
    name: 'subCategories',
    control: reactHookForm.control,
    keyName: 'customID'
  })

  useEffect(() => {
    if(category && isEditMode && !formUpdated) {
      reactHookForm.reset({
        nome: category.nome,
        descricao: category.descricao,
        subCategories: category.childCategories
      })
      setFormUpdated(true)
    }
  }, [category, formUpdated, isEditMode, reactHookForm, subCategories])
  

  return (
    <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit((category => {
      if(isEditMode) {
        onSave?.(category)
        return
      }
      addNewCategory.mutate(category)
    }))}
  >
    <div className='mb-4'>
      <Input
        placeholder='Nome'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('nome')}
      />
    </div>
    <div className='mb-4'>
      <Textarea
        placeholder='Descrição'
        style={{ minHeight: '100px' }}
        errors={reactHookForm.formState.errors.descricao?.message}
        {...reactHookForm.register('descricao')}
      />
    </div>
    <div className='mb-4'>
      <div className='category-container-header-sub-category'>
        <h3>Sub categorias</h3>
        <div>
        <button onClick={() => {
              subCategories.append({
                descricao: '',
                nome: ''
              })
            }} className='btn-remove w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Adicionar
            </button>
        </div>
      </div>
      {subCategories.fields.map((subCategory, index) => {
        return (
          <div key={subCategory.id} className='category-container-sub-category mb-4'>
            <div style={{ width: '100%' }}>
            <Input
              placeholder='Nome'
              errors={reactHookForm.formState.errors.subCategories?.[index]?.nome?.message}
              {...reactHookForm.register(`subCategories.${index}.nome`)}
            />
            </div>
            
            <div className='category-container-removed'>
                <button disabled={!!subCategory.id} onClick={() => {
                  subCategories.remove(index)
                }} className='btn-remove w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                  <i className='fa fa-trash'></i>
                </button>
              </div>
          </div>
        )
      })}
    </div>
    <div className='mb-5 text-center container-footer'>
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