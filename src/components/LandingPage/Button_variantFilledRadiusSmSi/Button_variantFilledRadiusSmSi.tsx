import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './Button_variantFilledRadiusSmSi.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    button?: ReactNode;
  };
}
/* @figmaId 101:681 */
export const Button_variantFilledRadiusSmSi: FC<Props> = memo(function Button_variantFilledRadiusSmSi(props = {}) {
  return (
    <button className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.buttonFilledSMFalseFalseFalseD}>
        {props.text?.button != null ? props.text?.button : <div className={classes.button}>Button</div>}
      </div>
    </button>
  );
});
