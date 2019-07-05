const baseUrl = 'https://fanfox.net';

export const fanfoxProvider = {
  isSupported(url: string) {
    return url.startsWith(baseUrl);
  },

  async processAsync(image: string) {
    // Initialize the canvas.
    const element = await convertAsync(image);
    const canvas = document.createElement('canvas');
    canvas.height = element.height;
    canvas.width = element.width;

    // Initialize the context
    const context = canvas.getContext('2d');
    if (!context) throw new Error();
    context.drawImage(element, 0, 0, element.width, element.height);

    // Initialize the data.
    const data = context.getImageData(0, 0, element.width, element.height);
    const count = countLines(data.data, element.width, element.height);
    if (!count) return canvas.toDataURL();

    // Initialize the result.
    canvas.height -= count;
    context.putImageData(data, 0, 0);
    return canvas.toDataURL();
  }
};

async function convertAsync(image: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.addEventListener('error', reject);
    element.addEventListener('load', () => resolve(element));
    element.src = `data:;base64, ${image}`;
  });
}

function countLines(data: Uint8ClampedArray, width: number, height: number) {
  let count = -1;
  let firstY = -1;
  let lastY = -1;
  for (let y = 0; y < 80 && y < height; y += 1) {
    const line = countTotals(data, width, height - y - 1);
    if (!line) {
      if (y === 0) return 0;
      firstY = firstY === -1 ? (firstY > 5 ? 5 : y) : firstY;
      lastY = y;
    } else if (lastY !== -1 && line.r >= 245 && line.g >= 245 && line.b >= 245) {
      count = firstY + lastY;
    }
  }
  return count;
}

function countTotals(data: Uint8ClampedArray, width: number, y: number) {
  const totals = {b: 0, g: 0, r: 0};
  for (let x = 0, index = y * width * 4; x < width; x++, index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    if (r < 45 || g < 45 || b < 45) return undefined;
    totals.r += r;
    totals.g += g;
    totals.b += b;
  }
  return {
    b: Math.round(totals.b / width),
    g: Math.round(totals.g / width),
    r: Math.round(totals.r / width)
  };
}
