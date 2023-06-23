import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './Button_variantOutlineRadiusSmS.module.css';

interface Props {
  className?: string;
  classes?: {
    buttonFilledSMFalseFalseFalseD?: string;
  };
  text?: {
    button?: ReactNode;
  };
}
/* @figmaId 101:687 */
export const Button_variantOutlineRadiusSmS: FC<Props> = memo(function Button_variantOutlineRadiusSmS(props = {}) {
  return (
    <button className={`${resets.clapyResets} ${classes.root}`}>
      <div
        className={`${props.classes?.buttonFilledSMFalseFalseFalseD || ''} ${classes.buttonFilledSMFalseFalseFalseD}`}
      >
        {props.text?.button != null ? props.text?.button : <div className={classes.button}>Button</div>}
      </div>
    </button>
  );
});
