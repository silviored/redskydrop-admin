/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Input } from '@/components/input'
import './styles.css'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchema } from './form-validation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AddressService, ApiService } from '@/services';
import { toast } from 'react-toastify';
import { ROUTES } from '@/constants/routes';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Select } from '@/components/select';
import { QUERY_KEYS } from '@/constants/keys';
import { Loading } from '@/components/loading';
import moment from 'moment';
import { MASKS } from '@/constants/mask';
import { currencyMask } from '@/utils/mask';
import { Textarea } from '@/components/textarea';
import { SELECT_BRAZILIAN_STATES } from '@/constants/brazilian-states';

type FormProps = {
  isEditMode?: boolean
  onSave?: (user: UserRequestApi) => Promise<void>
  user?: UserResponseApi
}

export function Form({ onSave, user, isEditMode }: FormProps) {
  const [loading, setLoading] = useState(false)
  const [formUpdated, setFormUpdated] = useState<boolean>(false)
  const navigation = useRouter()
  const reactHookForm = useForm<UserRequestApi>({
    resolver: zodResolver(createSchema),
  });


  const { data: plans, isLoading: isLoadingPlans } = useQuery<PlanResponseApi[]>(
    QUERY_KEYS.PLANS.LIST,
    async () => ApiService.Plan.getAll()
  );

  const addNewUser = useMutation({
    mutationFn: async (user: UserRequestApi) => {
      await ApiService.User.create({
        ...user,
        tipo: '1',
        ativado: user.plano_id ? '1' : '0'
      })
    },
    onSuccess: (_data, user: UserRequestApi) => {
      setLoading(false)
      toast.success(`O usuário ${user.nome} foi adicionado com sucesso!`,)
      navigation.push(ROUTES.USERS.LIST)
    },
    onError: (error: ApiError, user: UserRequestApi) => {
      toast.error(error.message || `Erro ao adicionar ${user.nome}!`)
      setLoading(false)
    },
  })


  useEffect(() => {
    if(user && isEditMode && !formUpdated) {
      const { assinaturas,...restUser } = user
      const paidSubscribes = assinaturas?.filter(subscriber => subscriber.status === 'ativo')
      reactHookForm.reset({
        ...restUser,
        plano_id: paidSubscribes?.[paidSubscribes?.length - 1]?.plano_id?.toString()
      })
      reactHookForm.setValue('data_nascimento_abertura', moment(restUser.data_nascimento_abertura).format(MASKS.DATE.EUA_WITHOUT_TIME))
      setFormUpdated(true)
    }
  }, [formUpdated, isEditMode, user, reactHookForm])

if(loading || isLoadingPlans) {
  return <Loading />
}
  
  return (
   <>
     <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit((user => {
      setLoading(true)
      if(isEditMode) {
        onSave?.(user)
        setLoading(false)
        return
      }
      addNewUser.mutate(user)
    }))}
  >
    <div className='user-container-grid-first-row mb-4'>
      <Input
        placeholder='Nome completo'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('nome')}
        
      />
      <Input
        placeholder='Email'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('email')}
        
      />
    </div>

    <div className='user-container-grid-store-name-row mb-4'>
    <Input
        placeholder='Nome da loja'
        errors={reactHookForm.formState.errors.nome_fantasia?.message}
        {...reactHookForm.register('nome_fantasia')}
        
      />
      <Input
        placeholder='Nome da loja 2'
        errors={reactHookForm.formState.errors.nome_loja_2?.message}
        {...reactHookForm.register('nome_loja_2')}
        
      />
      <Input
        placeholder='Nome da loja 3'
        errors={reactHookForm.formState.errors.nome_loja_3?.message}
        {...reactHookForm.register('nome_loja_3')}
        
      />  
    </div>

    <div className='user-container-grid-second-row mb-4'>
    <Input
        placeholder='Telefone'
        errors={reactHookForm.formState.errors.telefone?.message}
        {...reactHookForm.register('telefone')}
        maxLength={11}
        minLength={10}
      />
      <Input
        type='cpf_cnpj'
        placeholder='CPF ou CNPJ'
        errors={reactHookForm.formState.errors.cpf?.message}
        {...reactHookForm.register('cpf')}
      />
      <Input
        type='date'
        placeholder='Data de nascimento/abertura'
        max={moment().format(MASKS.DATE.EUA_WITHOUT_TIME)}
        errors={
          reactHookForm.formState.errors.data_nascimento_abertura?.message
        }
        {...reactHookForm.register('data_nascimento_abertura')}
      />
    <Input
        type='password'
        placeholder='Senha'
        errors={
          reactHookForm.formState.errors.password?.message
        }
        {...reactHookForm.register('password')}
      />
          <Select
        placeholder='Plano'
        errors={reactHookForm.formState.errors.plano_id?.message}
        {...reactHookForm.register('plano_id')}
        options={plans?.map(plan => ({ label: `${plan.nome} - R$ ${currencyMask(plan.preco)}`, value: plan.id })) || []}
        />
    </div>

    <div className='user-container-grid-second-row mb-4'>
    <Input
        placeholder='Cep'
        errors={reactHookForm.formState.errors.cep?.message}
        {...reactHookForm.register('cep')}
        maxLength={8}
        onChange={async (event) => {
          let value = event.target.value
          if(value) {
            value = value.replaceAll(/\D/g, '')
          }

          reactHookForm.setValue('cep', value)
          if (!value || value.replaceAll('_', '').length > 8) return

          await AddressService.getAddressByCEP(value).then((response) => {
            if (!response) return
            reactHookForm.setValue('logradouro', response.street)
            reactHookForm.setValue('cidade', response.city)
            reactHookForm.setValue('estado', response.state)
            reactHookForm.setValue('bairro', response.neighborhood)
          })
        }}
      />
      <Select
        placeholder='Estado'
        errors={reactHookForm.formState.errors.estado?.message}
        {...reactHookForm.register('estado')}
        options={SELECT_BRAZILIAN_STATES}
      />
      <Input
        placeholder='Cidade'
        errors={
          reactHookForm.formState.errors.cidade?.message
        }
        {...reactHookForm.register('cidade')}
      />
    <Input
        placeholder='Bairro'
        errors={
          reactHookForm.formState.errors.bairro?.message
        }
        {...reactHookForm.register('bairro')}
      />
    <Input
        placeholder='Logradouro'
        errors={
          reactHookForm.formState.errors.logradouro?.message
        }
        {...reactHookForm.register('logradouro')}
      />
    <Input
        placeholder='Número'
        errors={
          reactHookForm.formState.errors.numero?.message
        }
        {...reactHookForm.register('numero')}
      />

    </div>

    <div>
    <Textarea
        placeholder='Complemento'
        style={{ minHeight: '100px' }}
        errors={
          reactHookForm.formState.errors.complemento?.message
        }
        {...reactHookForm.register('complemento')}
      />
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
   </>
  )
}