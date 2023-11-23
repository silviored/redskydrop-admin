'use client';
import './styles.css';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/keys';
import { ApiService } from '@/services';
import { currencyMask } from '@/utils/mask';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loading } from '../loading';

type CardProps = PlanResponseApi;


export function Card({ id, nome, preco, periodo }: CardProps) {

  const navigation = useRouter();
  return (
    <div className='container-card'>
      <div>
        <img
          src='https://primodrop.com.br/assets/img/icon%20plan%20anual.png'
          alt=''
        />
      </div>
      <div className='flex flex-col items-center justify-center'>
        <h2 className='title text-white'>{nome}</h2>
        <h1 className='text-white'>{'R$ ' + currencyMask(preco)}</h1>
      </div>

      <div className='container-button'>
        <span className='text-white'>
          {periodo === 12 ? 'Ciclo Anual' : 'Ciclo Mensal'}
        </span>
        <button
          onClick={() => {
            navigation.push(`/select-plan/${id}/payment`);
          }}
          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-white px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-black shadow-md'
        >
          Pagar Agora
        </button>
      </div>
    </div>
  );
}

export function Info({ description }: { description: string }) {
  return (
    <div className='flex items-center'>
      <p>
        <i className='fa fa-check' aria-hidden='true'></i> {description}
      </p>
    </div>
  );
}

const HIGHLIGHT_STORE = [
  'Facilita as transações comerciais por usar apenas a moeda brasileira, e não o dólar (para drop nacional);',
  'Otimiza as operações logísticas, devido às menores distâncias;',
  'Opera com um tempo menor de entrega do produto ao cliente;',
  'Tem uma operação de trocas dentro do território nacional;',
  'Não paga impostos de importação.',
];

const CHARACTERISTICS_SUBSCRIPTION = [
  'Excelentes Prazos de entrega;',
  'Preços menores ou similares ao do Aliexpress;',
  'Tudo automatizado, assim como Dsers e Oberlo;',
  'Produtos validados de alta conversão;',
  'Fornecedores com menor preço e maior margem de lucros;',
  'Opção de Logística integrada com a plataforma;',
  'Vendas ilimitadas;',
  'Suporte online.',
];

export function Plans() {
  const query = useSearchParams()
  const not_skip = query.get('not_skip')
  const { data = [], isLoading } = useQuery<PlanResponseApi[]>(
    QUERY_KEYS.PLANS.LIST,
    async () => ApiService.Plan.getAll()
  );

  if (isLoading) {
    return <Loading/>
  }
  return (
    <div className=''>
      <div className='flex flex-wrap '>
        <div className='mx-auto px-3'>
          {/* relative z-0 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border shadow-xl */}
          <div className='rounded-2xl bg-white shadow-xl'>
            {not_skip !== 'true' && (
              <div className='flex justify-end p-4'>
              <Link href='/dashboard'>Pular escolha</Link>
            </div>
            )}
            <div className='mb-0 rounded-t-2xl border-b-0 bg-white p-6 text-center'>
              <h2 className='mx-auto text-black'>Escolha um plano</h2>
            </div>
            <div className='container-list-card'>
              {data?.map((card) => <Card key={card.id} {...card} />)}
            </div>
            <div className='container-description'>
              <div className='container-description-content'>
                <h2 className='title'>
                  Tudo que você Lojista precisa está aqui:
                </h2>
                <div>
                  {HIGHLIGHT_STORE.map((item) => (
                    <Info key={item} description={item} />
                  ))}
                </div>
              </div>
              <div className='container-description-content'>
                <h2 className='title'>Características das assinaturas:</h2>
                <div>
                  {CHARACTERISTICS_SUBSCRIPTION.map((item) => (
                    <Info key={item} description={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
