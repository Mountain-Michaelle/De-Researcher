import React from 'react'
interface ShowFooter{
    showFooter:boolean
}
function Footer({showFooter}:ShowFooter) {
    const currentYear = new Date().getFullYear();
  return (
    //   {/* Footer */}
      <footer className={
        !showFooter ? "hidden" : 
        `py-12 pl-20 flex-col w-ful bg-[#D9D9D90A] md:flex-col sm:flex-col lg:flex-col`}
      >

            <div className='flex flex-col md:flex-row gap-8 
            justify-center mb-22 w-full items-center '>

                <div className='flex gap-4 md:gap-20 text-gray-300 '>
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


                <div className='flex space-x-8 text-gray-300'>
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
            </div>
        
            <div className='w-full mt-10'>
              <p className="text-gray-300 text-center mt-8 pb-5">© Bloc-Search {currentYear}; All rights reserved.</p>  
            </div>
      
      </footer>
  )
}

export default Footer