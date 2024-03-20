import Image from 'next/image';
import planeIcon from '@icons/hotelIcons/plane.svg';

const PlaneLoader = () => {
  return (
    <div className="sky">
      <div className="plane"></div>
      <div className="flight-route">
        <i className="fa fa-plane">
          <Image src={planeIcon} width={32} height={32} alt="Plane" />
        </i>

        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        <div className="dot dot4"></div>
        <div className="dot dot5"></div>
        <div className="dot dot6"></div>
        <div className="dot dot7"></div>
        <div className="dot dot8"></div>
        <div className="dot dot9"></div>
        <div className="dot dot10"></div>
        <div className="dot dot11"></div>
        <div className="dot dot12"></div>
        <div className="dot dot13"></div>
        <div className="dot dot14"></div>
      </div>
    </div>
  );
};

export default PlaneLoader;
