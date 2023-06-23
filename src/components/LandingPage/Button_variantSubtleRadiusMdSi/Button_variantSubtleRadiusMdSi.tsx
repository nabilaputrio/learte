import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './Button_variantSubtleRadiusMdSi.module.css';

interface Props {
  className?: string;
  classes?: {
    buttonFilledMMFalseFalseFalseD?: string;
    root?: string;
  };
  text?: {
    button?: ReactNode;
  };
}
/* @figmaId 101:717 */
export const Button_variantSubtleRadiusMdSi: FC<Props> = memo(function Button_variantSubtleRadiusMdSi(props = {}) {
  return (
    <button className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div
        className={`${props.classes?.buttonFilledMMFalseFalseFalseD || ''} ${classes.buttonFilledMMFalseFalseFalseD}`}
      >
        {props.text?.button != null ? props.text?.button : <div className={classes.button}>Button</div>}
      </div>
    </button>
  );
});
