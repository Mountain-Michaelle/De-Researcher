import React from 'react'

function Footer({showFooter}) {
  return (
    //   {/* Footer */}
      <footer className={
        showFooter === true ? "hidden" : "py-12 pl-20 flex flex-col lg:justify-between sm:pl-5 sm:pr-5 pr-20 bg-[#D9D9D90A] md:flex-col sm:flex-col lg:flex-row"
    }
      >

        <div className='lg:w-[30%] flex flex-start '>
          <p className="text-gray-300 md:hidden  hidden lg:flex  ">© Bloc-Search 2024</p>  
         </div>

          <div className='flex flex-col justify-center gap-10'>
            <div className='flex flex-col gap-3 items-center w-[100%]'>
              <div className='flex gap-8 md:gap-20 text-gray-300 '>
                {[
                  { 
                      title: 'facebook',
                      image: 'images/social/facebook.svg'
                  },
                  { 
                      title: 'telegram',
                      image: 'images/social/telegram.svg'
                  },
                  { 
                      title: 'twitter',
                      image: 'images/social/twitter.svg'
                  },
                  { 
                      title: 'instagram',
                      image: 'images/social/instagram.svg'
                  }
              ].map((social, index) => {
                  return(
                      <img key={index} src={social.image} width={40} alt={social.title} />
                  )
              })}
              </div>
              
              <div className='w-full'>
              <p className="text-gray-300 text-center pt-8 m-0">© Bloc-Search 2024</p>  
            </div>
            </div>

          </div>

        <div className='flex flex-row lg:justify-end v w-[100%] justify-center
         text-gray-300 gap-4 lg:w-[30%] md:w-[initial] md:justify-center '>
           { [
              {
                title: 'About',
              },
              {
                title: 'Support',
              },
              {
                title: 'Terms',
              },
              {
                title: 'Privacy',
              },
            ].map((name, index) => {
              return(
                <div key={index}>
                  {name.title}
                </div>
              )
            })}
        </div>
      </footer>
  )
}

export default Footer