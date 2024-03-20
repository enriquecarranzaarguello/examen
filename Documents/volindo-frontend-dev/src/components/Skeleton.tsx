import React from 'react';

const Skeleton = () => {
  return (
    <div className="flex items-center mt-4 xs:mx-1 py-[10px] pr-[42px] xs:px-[5px] xs:flex-col xs:grid-cols-1">
      <div className="skeleton w-full mb-[20px] sm:mb-0 bg-[#dbdbdb] md:w-[200px] grow-0 shrink-0 min-h-[160px] rounded-[12px] sm:mr-[17px] sm:hidden md:flex xs:flex-col xs:min-w-[250px] xs:min-h-[200px]"></div>

      <div className="w-full flex flex-col grow">
        <div className="skeleton lg:w-[80%] xl:w-[70%] h-[36px] bg-[#dbdbdb] mb-[6px] rounded-[7px]"></div>
        <div className="skeleton mb-[6px] lg:w-[80%] xl:w-[40%] h-[41px] bg-[#dbdbdb] sm:mb-[20px] rounded-[7px]"></div>
        <div className="skeleton hidden sm:block lg:w-[80%] xl:w-[15%] h-[16px] bg-[#dbdbdb] mb-[6px] rounded-[4px]"></div>
        <div className="skeleton lg:w-[80%] xl:w-[30%] h-[34px] bg-[#dbdbdb] rounded-[4px]"></div>
      </div>

      <div className="hidden flex-col ml-auto md:hidden lg:block">
        <div className="skeleton w-[149px] h-[33px] bg-[#dbdbdb] mb-[22px] rounded-[7px]"></div>
        <div className="skeleton w-[149px] h-[53px] bg-[#dbdbdb] mb-[6px] rounded-[7px]"></div>
        <div className="skeleton w-[149px] h-[41px] bg-[#dbdbdb] rounded-[7px]"></div>
      </div>

      <div className="flex flex-col justify-center items-center xs:hidden"></div>
    </div>
  );
};

export default Skeleton;
