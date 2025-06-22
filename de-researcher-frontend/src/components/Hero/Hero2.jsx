import React from 'react'
import HeroImg from './svg/heroImg.svg';
import ForwardIcon from './svg/forwardarrow.svg';

function Hero2() {
  return (
    <div className="text-gray-50 w-full mb-10 flex md:flex-row justify-center ">
    {[
      {
        step: "Step 1",
        title: "The Future of Decentralized Research is here!",
        description:
          " Our platform connects innovators with researchers across the globe. Submit your project topics with specific requirements, and researchers can contribute to the solutions while earning rewards. With every contribution verified by expert communities, the integrity of research is maintained. All you need is your web3 wallet—no registration required",
      },
    ].map((item, index) => (
      <div
        key={index}
        className="bg-custom-gradient2 
         border-customBorder w-[95%] lg:w-[80%] h-fit p-3 rounded-lg overflow-hidden
          relative text-left w-90 ">
        <div className='w-full lg:w-[80%]'>
            <h4 className="mt-4 text-center lg:text-left text-[120%] lg:text-4xl md:text-3xl sm:text-3xl font-semibold">{item.title}</h4>
            <p className="mt-2 text-base text-wrap text-gray-400">{item.description}</p>

            <button className="flex items-center mt-8 bg-custom-gradient text-base px-7 py-2 rounded-full my-6 ">
                <span>
                   See how it works 
                </span>

                <span className='ml-5'>
                    <img src={ForwardIcon} alt="" />
                </span>
            </button>    
        </div>


        
        <img src={HeroImg} className='absolute right-0 bottom-0 -z-10' width={200} alt=""/>
      </div>
    ))}
  </div>
  )
}

export default Hero2;