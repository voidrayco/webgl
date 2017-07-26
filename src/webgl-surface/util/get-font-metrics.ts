interface IGetFontMetricsProps {
  ctx: CanvasRenderingContext2D;
  text: string;
  bboxHeight: number;
  fontFamily: string
  baseline?: string;
  flip?: boolean;
  drawBaseline?: boolean;
  fontSize: number;
}

export function getFontMetrics(props: IGetFontMetricsProps) {
  const ctx = props.ctx;
  const text = props.text;
  const bboxHeight = props.bboxHeight;
  const canvasHeight = props.ctx.canvas.height;
  const baseline = props.baseline || 'alphabetic';
  const flip = props.flip || false;
  const drawBaseline = props.drawBaseline || false;

  let fontFamily = 'Arial, san-serif';
  let fontSize = 14;

  if (props.fontFamily) {
    fontFamily = props.fontFamily;
  }

  if (props.fontSize) {
    fontSize = props.fontSize;
  }

  // Setting up the canvas
  ctx.save(); // Create canvas to use as buffer
  ctx.font = `${fontSize}px ${fontFamily}`;
  const textWidth = ctx.measureText(text).width;
  // This keeps font in-screen, measureText().width doesn't
  // Quite do it in some cases. For instance "j", or the letter "f"
  // In the font "Zapfino".
  const offsetx = fontSize * 2;
  let offsety = fontSize * 2;
  const cwidth = ctx.canvas.width = Math.round(textWidth + offsetx * 2);
  const cheight = ctx.canvas.height = canvasHeight ? canvasHeight : Math.round(offsety * 2);

  if (typeof(baseline) === 'string') {
    offsety = 0; // Using <canvas> baseline
    ctx.textBaseline = baseline;
  }

  // Ctx.font has to be called twice because resetting the size resets the state
  if (flip) {
    ctx.scale(1, -1);
  }

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillText(text, offsetx, (typeof(bboxHeight) === 'number' ? bboxHeight : offsety));

  // Drawing baseline
  if (drawBaseline) {
    ctx.fillRect(0, canvasHeight / 2, ctx.canvas.width, 1);
  }

  // Grabbing image data
  const imageData = ctx.getImageData(0, 0, cwidth, cheight);
  const data = imageData.data;
  // Calculating top
  const top = 0;
  let pos = data.length;
  let bottom = 0;
  let realBottom = 0;
  let left = 0;
  let right = 0;

  while (pos > 0) {
    if (data[pos + 3]) {
      pos -= pos % (cwidth * 4); // Back to beginning of the line top = (pos / 4) / cwidth; // calculate pixel position top -= offsety - fontSize; pos = data.length; // exit loop } pos += 4; } // calculating bottom var bottom = 0; var pos = data.length; while (pos > 0) {

      if (data[pos + 3]) {
        pos -= pos % (cwidth * 4); // Back to beginning of the line
        bottom = (pos / 4) / cwidth;
        bottom -= offsety - fontSize;
        pos = 0; // Exit loop
      }

      pos -= 4;
    }

    // Calculating left
    left = 0;
    let col = 0;
    let row = 0; // Left bounds

    while (row < cheight && col < cwidth) {
      const px = data[(row * cwidth * 4) + (col * 4) + 3];

      if (px) {
        left = col - offsetx;
        row = cheight;
        col = cwidth;
      }

      row ++;

      if (row % cheight === 0) {
        row = 0;
        col++;
      }
    }

    // Calculating right
    right = 0;
    col = cwidth;
    row = 0; // Right bounds

    while (row < cheight && col > 0) {
      if (data[(row * cwidth * 4) + (col * 4) + 3]) {
        right = col - offsetx;
        row = cheight;
        col = cwidth;
      }

      row ++;

      if (row % cheight === 0) {
        row = 0;
        col --;
      }
    }

    // Calculating real-bottom
    realBottom = 0;
    pos = data.length;

    while (pos > 0) {
      if (data[pos + 3]) {
        pos -= pos % (cwidth * 4); // Back to beginning of the line
        realBottom = (pos / 4) / cwidth;
        pos = 0; // Exit loop
      }

      pos -= 4;
    }

    // Restoring state
    ctx.restore();
  }

  // Returning raw-metrics
  return {
    bottom: realBottom,
    height: (bottom - top),
    left: (-left),
    top: (fontSize - top),
    width: (right - left),
  };
}
