export { BaseBuffer } from './base-buffer';

import { SharedControlCurvedLineBuffer } from './static/shared-control-curved-line-buffer';
import { SimpleStaticBezierLineBuffer } from './static/simple-bezier-line-buffer';
import { SimpleStaticCircularLineBuffer } from './static/simple-circular-line-buffer';
import { SimpleStaticLabelBuffer } from './static/simple-label-buffer';

const Static = {
  SharedControlCurvedLineBuffer,
  SimpleStaticBezierLineBuffer,
  SimpleStaticCircularLineBuffer,
  SimpleStaticLabelBuffer
}

export {
  Static
};
