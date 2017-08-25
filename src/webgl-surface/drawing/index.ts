import { ReferenceColor } from './reference/reference-color';

import { CircleShape } from './shape/circle-shape';
import { CurvedLineShape } from './shape/curved-line-shape';
import { EdgeShape } from './shape/edge-shape';
import { ImageShape } from './shape/image-shape';
import { Label } from './shape/label';
import { LineShape } from './shape/line-shape';
import { QuadShape } from './shape/quad-shape';

import { AtlasColor } from './texture/atlas-color';
import { AtlasManager } from './texture/atlas-manager';
import { AtlasTexture } from './texture/atlas-texture';
import { Sprite } from './texture/sprite';

const Reference = {
  ReferenceColor
};

const Shape = {
  CircleShape,
  CurvedLineShape,
  EdgeShape,
  ImageShape,
  Label,
  LineShape,
  QuadShape,
}

const Texture = {
  AtlasColor,
  AtlasManager,
  AtlasTexture,
  Sprite,
}

export {
  Reference,
  Shape,
  Texture,
}
