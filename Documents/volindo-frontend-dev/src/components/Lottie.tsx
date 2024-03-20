import { FC, useEffect, useRef, useState } from 'react';
import type {
  AnimationEventCallback,
  BMCompleteEvent,
  BMCompleteLoopEvent,
  LottiePlayer,
} from 'lottie-web';

export interface LottieProps {
  src: string;
  className?: string;
  loop?: boolean;
  speed?: number;
  complete?: AnimationEventCallback<BMCompleteEvent>;
  loopComplete?: AnimationEventCallback<BMCompleteLoopEvent>;
  animationReady?: AnimationEventCallback<undefined>;
}

export const Lottie: FC<LottieProps> = ({
  src,
  className = '',
  speed = 1,
  loop = true,
  complete,
  loopComplete,
  animationReady,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import('lottie-web').then(Lottie => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop,
        autoplay: true,
        path: src,
      });

      animation.setSpeed(speed);

      let completeHandler: (event: BMCompleteEvent) => void;
      if (typeof complete === 'function') {
        completeHandler = event => complete(event);
        animation.addEventListener('complete', completeHandler);
      }

      let completeLoopHandler: (event: BMCompleteLoopEvent) => void;
      if (typeof loopComplete === 'function') {
        completeLoopHandler = event => loopComplete(event);
        animation.addEventListener('loopComplete', completeLoopHandler);
      }

      let readyHandler: (event: undefined) => void;
      if (typeof animationReady === 'function') {
        readyHandler = (event: undefined) => animationReady(event);
        animation.addEventListener('data_ready', readyHandler);
      }

      return () => {
        if (completeHandler) {
          animation.removeEventListener('complete', completeHandler);
        }

        if (completeLoopHandler) {
          animation.removeEventListener('loopComplete', completeLoopHandler);
        }

        if (typeof readyHandler === 'function') {
          animation.removeEventListener('data_ready', readyHandler);
        }

        animation.destroy();
      };
    }
  }, [lottie, src, loop, speed, complete, loopComplete, animationReady]);

  return <div className={className} ref={ref} />;
};
