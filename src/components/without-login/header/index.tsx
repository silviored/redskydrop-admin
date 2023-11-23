export function Header() {
  return (
    <nav className='top-0 z-30 mb-4 mt-6 flex w-full flex-wrap items-center justify-between px-4 py-2 shadow-none lg:flex-nowrap lg:justify-start'>
      <div className='container flex items-center justify-between py-0 flex-wrap-inherit'>
        <button
          navbar-trigger='true'
          className='ml-2 cursor-pointer rounded-lg border border-solid border-transparent bg-red-400 px-3 py-1 text-lg leading-none shadow-none transition-all ease-in-out lg:hidden'
          type='button'
          aria-controls='navigation'
          aria-expanded='false'
        >
          <span className='mt-2 inline-block h-6 w-6 bg-none bg-cover bg-center bg-no-repeat align-middle'>
            <span
            // @ts-ignore
              bar1=''
              className='relative mx-auto my-0 block h-px w-5.5 rounded-xs bg-white transition-all  duration-350'
            ></span>
            <span
            // @ts-ignore
              bar2=''
              className='relative mx-auto my-0 mt-1.75 block h-px w-5.5 rounded-xs bg-white transition-all  duration-350'
            ></span>
            <span
            // @ts-ignore
              bar3=''
              className='relative mx-auto my-0 mt-1.75 block h-px w-5.5 rounded-xs bg-white transition-all  duration-350'
            ></span>
          </span>
        </button>
        <div
          navbar-menu=''
          className='ease mt-4 flex-grow basis-full items-center justify-end rounded-2xl shadow-3xl transition-all duration-350 lg:flex lg:basis-auto lg:shadow-none lg-max:max-h-0 lg-max:overflow-hidden'
        >
          {/* <div className="h-19">
            <i className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times dark:text-white text-slate-400 xl:hidden" sidenav-close="" aria-hidden="true"></i>
            <a className="block px-8 py-6 m-0 text-sm whitespace-nowrap dark:text-white text-slate-700" href="https://demos.creative-tim.com/argon-dashboard-tailwind/pages/dashboard.html" target="_blank">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                src='https://primodrop.com.br/assets/img/brand/logo.png?v=2'
                alt=''
                style={{
                  width: 'auto',
                  height: '30px'
                }}
              />
              </div>
            </a>
          </div> */}
          {/* <div className='w-full px-5'>
          <hr className="h-px mt-0 mb-0 bg-black dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent"></hr>
          </div> */}
          <ul className='mb-0 flex list-none  flex-col pl-0 lg:flex-row lg-max:py-2'>
            <li>
              <a
                className='mr-2 flex items-center px-4 py-2 font-normal transition-all duration-250 ease-in-out lg:px-2 lg:hover:text-white/85 lg-max:text-slate-700 lg-max:opacity-0'
                href='../pages/profile.html'
              >
                <i
                  className='fa fa-whatsapp mr-2 lg-max:text-slate-700'
                  aria-hidden='true'
                ></i>
                Suporte
              </a>
            </li>
            <li>
              <a
                className='mr-2 flex items-center px-4 py-2 font-normal transition-all duration-250 ease-in-out lg:px-2 lg:hover:text-white/85 lg-max:text-slate-700 lg-max:opacity-0'
                href='../pages/sign-up.html'
              >
                <i
                  className='fas fa-user-circle mr-2 lg-max:text-slate-700'
                  aria-hidden='true'
                ></i>
                Criar nova conta
              </a>
            </li>
            <li>
              <a
                className='mr-2 flex items-center px-4 py-2 font-normal transition-all duration-250 ease-in-out lg:px-2 lg:hover:text-white/85 lg-max:text-slate-700 lg-max:opacity-0'
                href='../pages/sign-in.html'
              >
                <i
                  className='ni ni-bag-17 mr-2 lg-max:text-zinc-900'
                  aria-hidden='true'
                ></i>
                Catálogo
              </a>
            </li>
          </ul>

          <ul className='mb-0 hidden list-none pl-0 lg:block lg:flex-row'>
            <li></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
